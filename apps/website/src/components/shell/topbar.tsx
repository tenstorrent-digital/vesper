import Link from "next/link";

import { IconButton } from "@tenstorrent/vesper/icon-button";
import { SocialGitHub, Tenstorrent } from "@tenstorrent/vesper/icons";
import { ThemeSwitcher } from "@tenstorrent/vesper/theme-switcher";
import { Typography } from "@tenstorrent/vesper/typography";

import { AgentModeToggle } from "@/components/agents/agent-mode";
import { SearchTrigger } from "@/components/search/search-trigger";

import { GITHUB_URL } from "@/lib/constants";
import { navTitles } from "@/lib/nav";
import { VESPER_VERSION } from "@/lib/version";

import { Breadcrumbs } from "./breadcrumbs";
import { MobileNav } from "./mobile-nav";
import { PlaygroundLink } from "./playground-link";
import { railSections } from "./rail";

export const TopBar = () => (
  <header className="topbar">
    <Link href="/" className="topbar-brand" aria-label="Vesper home">
      <span className="topbar-mark" aria-hidden="true">
        <Tenstorrent />
      </span>
      <Typography as="span" variant="heading-sm" className="topbar-wordmark">
        Vesper
      </Typography>
      <Typography as="span" variant="label-xs-mono" className="topbar-version">
        v{VESPER_VERSION}
      </Typography>
    </Link>

    <Breadcrumbs titles={navTitles} />

    <div className="topbar-actions">
      <SearchTrigger />
      <PlaygroundLink />

      <IconButton
        className="topbar-only-wide"
        as="a"
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Vesper on GitHub"
        size="sm"
        variant="ghost"
        icon={<SocialGitHub />}
      />

      <AgentModeToggle />
      <ThemeSwitcher size="sm" />
      <MobileNav sections={railSections} />
    </div>
  </header>
);
