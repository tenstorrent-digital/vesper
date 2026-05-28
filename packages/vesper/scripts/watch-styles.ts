import chokidar from "chokidar";
import path from "node:path";
import { srcRoot, syncStyles } from "./sync-styles";

syncStyles();
console.log(`[watch-styles] synced CSS from ${srcRoot}`);

let timeout: NodeJS.Timeout | undefined;
const scheduleSync = (event: string, filePath: string) => {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    syncStyles();
    console.log(`[watch-styles] synced CSS after ${event}: ${path.relative(srcRoot, filePath)}`);
  }, 50);
};

const watcher = chokidar.watch(srcRoot, {
  ignored: (filePath, stats) => stats?.isFile() ? !filePath.endsWith(".css") : false,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 25,
  },
});

watcher
  .on("add", (filePath) => scheduleSync("add", filePath))
  .on("change", (filePath) => scheduleSync("change", filePath))
  .on("unlink", (filePath) => scheduleSync("unlink", filePath))
  .on("ready", () => {
    console.log(`[watch-styles] watching ${srcRoot} for CSS files`);
  })
  .on("error", (error) => {
    console.error("[watch-styles] watcher error", error);
    process.exitCode = 1;
  });
