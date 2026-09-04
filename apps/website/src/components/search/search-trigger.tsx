"use client";

import { IconButton } from "@tenstorrent/vesper/icon-button";
import { Search } from "@tenstorrent/vesper/icons";
import { Typography } from "@tenstorrent/vesper/typography";

import { openPalette } from "./open-palette";

/**
 * the search affordance in the top bar
 *
 * a full pill on wide viewports, and a plain icon button once there is no room
 * for it — both open the same palette
 */
export const SearchTrigger = () => (
  <>
    <button
      type="button"
      className="search-trigger topbar-only-wide"
      onClick={() => openPalette()}
      aria-keyshortcuts="Meta+K Control+K"
    >
      <Search />
      <Typography as="span" variant="copy-sm" className="search-trigger-label">
        Search docs…
      </Typography>
      <kbd className="kbd">⌘K</kbd>
    </button>

    <IconButton
      className="topbar-only-narrow"
      aria-label="Search documentation"
      size="sm"
      variant="ghost"
      icon={<Search />}
      onClick={() => openPalette()}
    />
  </>
);
