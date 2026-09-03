"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { IconButton } from "@tenstorrent/vesper/icon-button";
import { Close, Menu } from "@tenstorrent/vesper/icons";
import { Typography } from "@tenstorrent/vesper/typography";

import { RailNav, type RailSection } from "./rail-nav";

/**
 * the navigation drawer shown in place of the rail on narrow viewports
 *
 * closes on route change, on escape, and on a scrim click
 */
export const MobileNav = ({ sections }: { sections: RailSection[] }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <IconButton
        className="topbar-only-narrow"
        aria-label="Open navigation"
        aria-expanded={open}
        size="sm"
        variant="ghost"
        icon={<Menu />}
        onClick={() => setOpen(true)}
      />

      {open && (
        <div className="drawer">
          <button
            type="button"
            className="drawer-scrim"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />

          <div className="drawer-panel">
            <div className="drawer-header">
              <Typography variant="heading-sm">Navigation</Typography>
              <IconButton
                aria-label="Close navigation"
                size="sm"
                variant="ghost"
                icon={<Close />}
                onClick={() => setOpen(false)}
              />
            </div>

            <RailNav sections={sections} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};
