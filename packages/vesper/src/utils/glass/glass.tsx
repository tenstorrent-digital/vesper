"use client";

import { type CSSProperties, useCallback } from "react";

import { attachGlass, type GlassOptions } from "@/utils/glass/use-glass";

const HIDDEN_STYLE: CSSProperties = { display: "none" };

/**
 * Turns its parent element into glass, without making the parent a client component.
 *
 * Renders an empty, hidden `<span>` that attaches the effect to its parent element. Use this inside components that can be rendered by React Server Components; client components should use `useGlass` instead.
 *
 * @param {GlassDepth} [props.depth] - (optional) How far the glass bends light. @default regular
 * @param {boolean} [props.interactive] - (optional) Whether the sheen follows the pointer. @default false
 * @param {boolean} [props.disabled] - (optional) Turns the effect off. @default false
 *
 * @example
 * <div className="vesper-glass">
 *   <Glass depth="deep" />
 *   Content
 * </div>
 */
export function Glass(props: GlassOptions) {
  const { depth = "regular", interactive = false, disabled = false } = props;

  const ref = useCallback(
    (anchor: HTMLSpanElement | null) => {
      const parent = anchor?.parentElement;
      if (!parent || disabled) return undefined;
      return attachGlass(parent, { depth, interactive });
    },
    [depth, interactive, disabled],
  );

  return (
    <span ref={ref} hidden style={HIDDEN_STYLE} data-vesper-glass-anchor="" />
  );
}
