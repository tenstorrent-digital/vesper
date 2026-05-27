import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcRoot = path.resolve(__dirname, "../src");
const distRoot = path.resolve(__dirname, "../dist");

const copyCssFiles = (currentDir: string) => {
  for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
    const sourcePath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      copyCssFiles(sourcePath);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".css")) {
      continue;
    }

    const relativePath = path.relative(srcRoot, sourcePath);
    const destinationPath = path.join(distRoot, relativePath);

    mkdirSync(path.dirname(destinationPath), { recursive: true });
    copyFileSync(sourcePath, destinationPath);
  }
};

copyCssFiles(srcRoot);
