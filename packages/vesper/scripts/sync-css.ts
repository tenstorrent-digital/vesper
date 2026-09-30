import browserslist from "browserslist";
import { browserslistToTargets, transform } from "lightningcss";
import fs from "node:fs";
import path from "node:path";

import { resolvePackagePath } from "./utils";

type CSSRoot = "./src" | "./dist";

/**
 * Target browsers with >= 0.25% market share
 *
 * https://lightningcss.dev/transpilation.html#browser-targets
 */
const targets = browserslistToTargets(browserslist(">= 0.25%"));

// get paths (relative to `root`) of all css files inside `root`
const getCSSFiles = (root: CSSRoot, relativeDir = ""): string[] => {
  const dirPath = resolvePackagePath(`${root}/${relativeDir}`);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const cssFiles: string[] = [];

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const relativePath = path.join(relativeDir, entry.name);

    if (entry.isDirectory()) {
      cssFiles.push(...getCSSFiles(root, relativePath));
      continue;
    }

    if (
      entry.isFile() &&
      entry.name.endsWith(".css") &&
      entry.name !== "test.css"
    ) {
      cssFiles.push(relativePath);
    }
  }

  return cssFiles;
};

// remove empty directories inside `./dist` (relative to `./dist`)
const removeEmptyDirectories = (relativeDir = "") => {
  const dirPath = resolvePackagePath(`./dist/${relativeDir}`);

  if (!fs.existsSync(dirPath)) {
    return;
  }

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      removeEmptyDirectories(path.join(relativeDir, entry.name));
    }
  }

  // never remove `./dist` itself
  if (relativeDir !== "" && fs.readdirSync(dirPath).length === 0) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
};

/**
 * write `contents` to `./dist/${relativePath}` only if it differs from what is
 * already on disk
 *
 * @returns whether the file was actually written
 */
const writeIfChanged = (relativePath: string, contents: Buffer): boolean => {
  const destinationPath = resolvePackagePath(`./dist/${relativePath}`);

  if (
    fs.existsSync(destinationPath) &&
    fs.readFileSync(destinationPath).equals(contents)
  ) {
    return false;
  }

  fs.mkdirSync(resolvePackagePath(`./dist/${path.dirname(relativePath)}`), {
    recursive: true,
  });

  /*
    write + rename so consumers never observe a partially written file
    (`rename` is atomic within the same directory)
  */
  const temporaryPath = resolvePackagePath(
    `./dist/${path.join(path.dirname(relativePath), `.${path.basename(relativePath)}.tmp`)}`,
  );

  fs.writeFileSync(temporaryPath, contents);
  fs.renameSync(temporaryPath, destinationPath);

  return true;
};

export const syncCSS = async () => {
  const sourceCssFiles = new Set(getCSSFiles("./src"));
  const distCssFiles = new Set(getCSSFiles("./dist"));
  const changed: string[] = [];

  for (const relativePath of sourceCssFiles) {
    const css = fs.readFileSync(
      resolvePackagePath(`./src/${relativePath}`),
      "utf-8",
    );

    const result = transform({
      filename: relativePath,
      code: Buffer.from(css),
      minify: true,
      targets,
    });

    if (writeIfChanged(relativePath, Buffer.from(result.code))) {
      changed.push(relativePath);
    }
  }

  for (const relativePath of distCssFiles) {
    if (sourceCssFiles.has(relativePath)) {
      continue;
    }

    fs.rmSync(resolvePackagePath(`./dist/${relativePath}`), { force: true });
    changed.push(relativePath);
  }

  removeEmptyDirectories();

  return changed;
};
