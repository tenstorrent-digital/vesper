import Link from "next/link";

import { Button } from "@tenstorrent/vesper/button";
import { Typography } from "@tenstorrent/vesper/typography";

import { Breadcrumbs } from "./breadcrumbs";

export const Nav = () => {
  return (
    <nav id="nav" aria-label="Main Navigation">
      <div className="nav-group nav-left">
        <Typography as={Link} href="/" id="home" variant="heading-sm">
          Vesper
        </Typography>
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
