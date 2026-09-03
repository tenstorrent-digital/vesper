"use client";

import Link from "next/link";

import { SHOWCASE } from "@/components/showcase/registry";

/**
 * every component in the library, live, in one grid
 *
 * unlike the gallery these are *not* inert — the point of the wall is that you
 * can reach into it and start dragging sliders
 */
export const ComponentWall = () => (
  <div className="wall">
    {SHOWCASE.map((entry) => (
      <div key={entry.href} className="wall-cell">
        {entry.preview}
        <Link className="wall-name" href={entry.href}>
          {entry.name}
        </Link>
      </div>
    ))}
  </div>
);
