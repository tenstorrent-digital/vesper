"use client";

import { useCallback } from "react";

import {
  acquireGlassFilter,
  getGlassFilterKey,
  getGlassFilterParams,
  type GlassDepth,
} from "@/utils/glass/filter";

export interface GlassOptions {
  /** How deep the glass is. Deeper glass bends light further and frosts its backdrop more. @default regular */
  depth?: GlassDepth;
  /** When `true`, the glass's specular sheen follows the pointer. @default false */
  interactive?: boolean;
  /** When `true`, turns off refraction and pointer tracking. @default false */
  disabled?: boolean;
}

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: { brands?: { brand: string }[] };
};

let refractionSupport: boolean | undefined;

/**
 * Whether the browser can refract an element's backdrop through an svg filter
 *
 * Only chromium browsers support svg filters in `backdrop-filter` - other
 * browsers fall back to frosted (blurred) glass
 */
export function supportsGlassRefraction() {
  if (refractionSupport !== undefined) return refractionSupport;

  if (
    typeof window === "undefined" ||
    typeof CSS === "undefined" ||
    typeof CSS.supports !== "function"
  ) {
    return false;
  }

  // safari and firefox both report support for `url()` but don't render it,
  // so look for chromium explicitly (`userAgentData` is chromium only)
  const { userAgentData } = navigator as NavigatorWithUserAgentData;
  const isChromium = !!userAgentData?.brands?.some(
    ({ brand }) => brand === "Chromium",
  );

  refractionSupport =
    isChromium && CSS.supports("backdrop-filter", "url(#vesper-glass)");

  return refractionSupport;
}

const prefersReducedTransparency = () =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-transparency: reduce)").matches;

// one shared observer is much cheaper than one per element
const resizeCallbacks = new WeakMap<Element, () => void>();
let resizeObserver: ResizeObserver | undefined;

const observeResize = (element: Element, callback: () => void) => {
  resizeObserver ??= new ResizeObserver((entries) => {
    for (const entry of entries) resizeCallbacks.get(entry.target)?.();
  });

  resizeCallbacks.set(element, callback);
  resizeObserver.observe(element);

  return () => {
    resizeCallbacks.delete(element);
    resizeObserver?.unobserve(element);
  };
};

// css radii can be lengths, percentages, or elliptical pairs (eg. `50%`, `8px 4px`)
const resolveRadius = (element: HTMLElement, width: number, height: number) => {
  const [first = "0"] = getComputedStyle(element)
    .borderTopLeftRadius.trim()
    .split(/\s+/);
  const value = Number.parseFloat(first);
  if (Number.isNaN(value)) return 0;

  return first.endsWith("%") ? (value / 100) * Math.min(width, height) : value;
};

// wait for an element to stop resizing before rendering a new map
const RESIZE_DEBOUNCE = 120;

const FILTER_PROPERTY = "--vesper-glass-filter";
const REFRACTION_ATTRIBUTE = "data-vesper-glass-refraction";

const refract = (element: HTMLElement, depth: GlassDepth) => {
  let current: { key: string; release: () => void } | null = null;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const clear = () => {
    current?.release();
    current = null;
    element.style.removeProperty(FILTER_PROPERTY);
    element.removeAttribute(REFRACTION_ATTRIBUTE);
  };

  const update = () => {
    timeout = undefined;

    // layout size, which is unaffected by transforms (eg. while pressed)
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    if (!width || !height) return clear();

    const params = getGlassFilterParams({
      width,
      height,
      depth,
      radius: resolveRadius(element, width, height),
      devicePixelRatio: window.devicePixelRatio,
    });

    const key = getGlassFilterKey(params);
    if (current?.key === key) return undefined;

    const filter = acquireGlassFilter(element, params);
    if (!filter) return clear();

    current?.release();
    current = { key, release: filter.release };
    element.style.setProperty(FILTER_PROPERTY, `url(#${filter.id})`);
    element.setAttribute(REFRACTION_ATTRIBUTE, "");

    return undefined;
  };

  const unobserve = observeResize(element, () => {
    clearTimeout(timeout);

    // render the first map right away (before paint), then debounce while resizing
    if (!current) update();
    else timeout = setTimeout(update, RESIZE_DEBOUNCE);
  });

  return () => {
    unobserve();
    clearTimeout(timeout);
    clear();
  };
};

const POINTER_X_PROPERTY = "--vesper-glass-pointer-x";
const POINTER_Y_PROPERTY = "--vesper-glass-pointer-y";

const trackPointer = (element: HTMLElement) => {
  let frame = 0;
  let clientX = 0;
  let clientY = 0;

  const paint = () => {
    frame = 0;
    const rect = element.getBoundingClientRect();
    element.style.setProperty(POINTER_X_PROPERTY, `${clientX - rect.left}px`);
    element.style.setProperty(POINTER_Y_PROPERTY, `${clientY - rect.top}px`);
  };

  const handlePointerMove = (e: PointerEvent) => {
    clientX = e.clientX;
    clientY = e.clientY;
    frame ||= requestAnimationFrame(paint);
  };

  const handlePointerLeave = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    element.style.removeProperty(POINTER_X_PROPERTY);
    element.style.removeProperty(POINTER_Y_PROPERTY);
  };

  element.addEventListener("pointermove", handlePointerMove, { passive: true });
  element.addEventListener("pointerleave", handlePointerLeave);

  return () => {
    element.removeEventListener("pointermove", handlePointerMove);
    element.removeEventListener("pointerleave", handlePointerLeave);
    handlePointerLeave();
  };
};

/**
 * Turns an element into glass by refracting its backdrop through a
 * shader generated displacement map (chromium only). Interactive glass also
 * tracks the pointer so its specular sheen follows it
 *
 * The `vesper-glass` class provides the styling (tint, rim light, frosted
 * fallback), this only adds the parts that need javascript
 *
 * @returns a cleanup function
 */
export function attachGlass(
  element: HTMLElement,
  options: Omit<GlassOptions, "disabled"> = {},
) {
  const { depth = "regular", interactive = false } = options;
  const cleanups: (() => void)[] = [];

  if (interactive) cleanups.push(trackPointer(element));

  if (supportsGlassRefraction() && !prefersReducedTransparency()) {
    cleanups.push(refract(element, depth));
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}

/**
 * Returns a ref callback that turns the element it's attached to into glass.
 *
 * Pair it with the `vesper-glass` class, which provides the glass material.
 *
 * @param {GlassDepth} [options.depth] - (optional) How far the glass bends light. @default regular
 * @param {boolean} [options.interactive] - (optional) Whether the sheen follows the pointer. @default false
 * @param {boolean} [options.disabled] - (optional) Turns the effect off. @default false
 *
 * @example
 * const glassRef = useGlass({ interactive: true });
 * return <button ref={glassRef} className="vesper-glass" />;
 */
export function useGlass(options: GlassOptions = {}) {
  const { depth = "regular", interactive = false, disabled = false } = options;

  return useCallback(
    (element: HTMLElement | null) => {
      if (!element || disabled) return undefined;
      return attachGlass(element, { depth, interactive });
    },
    [depth, interactive, disabled],
  );
}
