import fs from "node:fs";

import { Tree } from "./tree";

// get all folders in /components
const componentPages = fs.readdirSync("src/app/components");

export const Sidebar = () => {
  return (
    <nav id="sidebar" aria-label="Sidebar">
      <Tree pages={componentPages} />
    </nav>
  );
};
