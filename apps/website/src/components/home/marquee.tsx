"use client";

import { SHOWCASE } from "@/components/showcase/registry";

/**
 * two strips of live components sliding past in opposite directions
 *
 * the track renders its items twice and translates by exactly -50%, so the
 * loop never seams. hovering anywhere on a strip pauses it, which is the only
 * way to get a proper look at a component you spotted going past
 */
const Strip = ({
  items,
  duration,
  reverse,
}: {
  items: typeof SHOWCASE;
  duration: number;
  reverse?: boolean;
}) => (
  <div className="marquee" inert aria-hidden="true">
    <div
      className="marquee-track"
      style={{
        animationDuration: `${duration}s`,
        animationDirection: reverse ? "reverse" : undefined,
      }}
    >
      {[...items, ...items].map((entry, index) => (
        <div key={`${entry.href}-${index}`} className="marquee-item">
          {entry.preview}
        </div>
      ))}
    </div>
  </div>
);

/**
 * the marquee is decorative — it is `aria-hidden`, and the same components are
 * reachable (and readable) in the wall further down the page
 */
export const ComponentMarquee = () => {
  const half = Math.ceil(SHOWCASE.length / 2);

  return (
    <div style={{ display: "grid", gap: "var(--vesper-spacing-3)" }}>
      <Strip items={SHOWCASE.slice(0, half)} duration={80} />
      <Strip items={SHOWCASE.slice(half)} duration={95} reverse />
    </div>
  );
};
