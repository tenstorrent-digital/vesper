import { cpSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcStyles = path.resolve(__dirname, "../src/styles");
const distStyles = path.resolve(__dirname, "../dist/styles");

mkdirSync(distStyles, { recursive: true });
cpSync(srcStyles, distStyles, { recursive: true });
