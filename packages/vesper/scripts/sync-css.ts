import browserslist from "browserslist";
import { browserslistToTargets, transform } from "lightningcss";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const srcRoot = path.resolve(__dirname, "../src");
export const distRoot = path.resolve(__dirname, "../dist");

/**
 * Target browsers with >= 0.25% market share
 *
 * https://lightningcss.dev/transpilation.html#browser-targets
 */
const targets = browserslistToTargets(browserslist(">= 0.25%"));

const getCSSFiles = (root: string, currentDir = root): string[] => {
  if (!existsSync(currentDir)) {
    return [];
  }

  const cssFiles: string[] = [];

  for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
    const entryPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      cssFiles.push(...getCSSFiles(root, entryPath));
      continue;
    }

    if (
      entry.isFile() &&
      entry.name.endsWith(".css") &&
      entry.name !== "test.css"
    ) {
      cssFiles.push(path.relative(root, entryPath));
    }
  }

  return cssFiles;
};

const removeEmptyDirectories = (currentDir: string) => {
  if (!existsSync(currentDir)) {
    return;
  }

  const entries = readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      removeEmptyDirectories(path.join(currentDir, entry.name));
    }
  }

  if (currentDir !== distRoot && readdirSync(currentDir).length === 0) {
    rmSync(currentDir, { recursive: true, force: true });
  }
};

/**
 * write `contents` to `destinationPath` only if it differs from what is
 * already on disk
 *
 * @returns whether the file was actually written
 */
const writeIfChanged = (destinationPath: string, contents: Buffer): boolean => {
  if (
    existsSync(destinationPath) &&
    readFileSync(destinationPath).equals(contents)
  ) {
    return false;
  }

  mkdirSync(path.dirname(destinationPath), { recursive: true });

  /*
    write + rename so consumers never observe a partially written file
    (`rename` is atomic within the same directory)
  */
  const temporaryPath = path.join(
    path.dirname(destinationPath),
    `.${path.basename(destinationPath)}.tmp`,
  );

  writeFileSync(temporaryPath, contents);
  renameSync(temporaryPath, destinationPath);

  return true;
};

export const syncCSS = async () => {
  const sourceCssFiles = new Set(getCSSFiles(srcRoot));
  const distCssFiles = new Set(getCSSFiles(distRoot));
  const changed: string[] = [];

  for (const relativePath of sourceCssFiles) {
    const sourcePath = path.join(srcRoot, relativePath);
    const destinationPath = path.join(distRoot, relativePath);
    const css = readFileSync(sourcePath, "utf-8");

    const result = transform({
      filename: relativePath,
      code: Buffer.from(css),
      minify: true,
      targets,
    });

    if (writeIfChanged(destinationPath, Buffer.from(result.code))) {
      changed.push(relativePath);
    }
  }

  for (const relativePath of distCssFiles) {
    if (sourceCssFiles.has(relativePath)) {
      continue;
    }

    rmSync(path.join(distRoot, relativePath), { force: true });
    changed.push(relativePath);
  }

  removeEmptyDirectories(distRoot);

  return changed;
};
