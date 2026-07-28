import fs from "node:fs";

import { Tree } from "./tree";

// get all folders in /components
const componentPages = fs
  .readdirSync("src/app/components")
  .filter((page) => !page.endsWith(".tsx"));

export const Sidebar = ({ className }: { className?: string }) => {
  return (
    <nav id="sidebar" aria-label="Sidebar" className={className}>
      <Tree pages={componentPages} />
    </nav>
  );
};
