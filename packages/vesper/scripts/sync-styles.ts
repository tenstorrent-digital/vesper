import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const srcRoot = path.resolve(__dirname, "../src");
export const distRoot = path.resolve(__dirname, "../dist");

const getCssFiles = (root: string, currentDir = root): string[] => {
  if (!existsSync(currentDir)) {
    return [];
  }

  const cssFiles: string[] = [];

  for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
    const entryPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      cssFiles.push(...getCssFiles(root, entryPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".css")) {
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

export const syncStyles = () => {
  const sourceCssFiles = new Set(getCssFiles(srcRoot));
  const distCssFiles = new Set(getCssFiles(distRoot));

  for (const relativePath of sourceCssFiles) {
    const sourcePath = path.join(srcRoot, relativePath);
    const destinationPath = path.join(distRoot, relativePath);

    mkdirSync(path.dirname(destinationPath), { recursive: true });
    copyFileSync(sourcePath, destinationPath);
  }

  for (const relativePath of distCssFiles) {
    if (sourceCssFiles.has(relativePath)) {
      continue;
    }

    rmSync(path.join(distRoot, relativePath), { force: true });
  }

  removeEmptyDirectories(distRoot);
};
