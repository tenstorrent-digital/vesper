"use client";

import { useSyncExternalStore } from "react";

// shared (module-level) state, so every `useBaseRemSize` hook observes a single element
let baseRemSize = 16;

let observer: ResizeObserver | null = null;
let el: HTMLSpanElement | null = null;

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  if (listeners.size === 0) observe();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) unobserve();
  };
};

const getSnapshot = () => baseRemSize;

const emitChanges = () => listeners.forEach((listener) => listener());

const observe = () => {
  const span = document.createElement("span");
  span.style.position = "fixed";
  span.style.zIndex = "-999999";
  span.style.display = "block";
  span.style.height = "1rem";
  span.style.visibility = "hidden";
  span.style.pointerEvents = "none";
  span.setAttribute("aria-hidden", "true");
  document.body.append(span);

  const updateBaseRemSize = () => {
    baseRemSize = span.getBoundingClientRect().height;
    emitChanges();
  };
  updateBaseRemSize();

  observer = new ResizeObserver(updateBaseRemSize);
  observer.observe(span);

  el = span;
};

const unobserve = () => {
  observer?.disconnect();
  el?.remove();
};

/**
 * Returns the document's base rem size in pixels.
 *
 * @example
 * const baseRemSize = useBaseRemSize()
 * console.log(baseRemSize) // 16
 */
export function useBaseRemSize() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
