import Link from "next/link";

import { Button } from "@repo/vesper/button";
// import { IconButton } from "@repo/vesper/icon-button";
// import { Menu } from "@repo/vesper/icons";
import { Typography } from "@repo/vesper/typography";

import { Breadcrumbs } from "./breadcrumbs";

export const Nav = () => {
  return (
    <nav id="nav" aria-label="Main Navigation">
      <div className="nav-group nav-left">
        {/*
            <IconButton
            className="mobile"
            variant="tertiary"
            size="sm"
            icon={<Menu />}
          />*/}
        {/* later */}
        <Link href="/" id="home">
          <Typography as="span" variant="heading-sm">
            Vesper
          </Typography>
        </Link>
        <Breadcrumbs />
      </div>
      <div className="nav-group">
        <Button
          as="a"
          href={
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000"
              : "/storybook"
          }
          variant="tertiary"
          size="sm"
        >
          Playground
        </Button>
      </div>
    </nav>
  );
};
