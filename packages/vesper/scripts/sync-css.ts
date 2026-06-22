import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import browserslist from "browserslist";
import { transform, browserslistToTargets } from "lightningcss";

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

console.log(JSON.stringify(targets, null, 2));

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

export const syncCSS = async () => {
  const sourceCssFiles = new Set(getCSSFiles(srcRoot));
  const distCssFiles = new Set(getCSSFiles(distRoot));

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

    mkdirSync(path.dirname(destinationPath), { recursive: true });
    writeFileSync(destinationPath, result.code);
  }

  for (const relativePath of distCssFiles) {
    if (sourceCssFiles.has(relativePath)) {
      continue;
    }

    rmSync(path.join(distRoot, relativePath), { force: true });
  }

  removeEmptyDirectories(distRoot);
};
