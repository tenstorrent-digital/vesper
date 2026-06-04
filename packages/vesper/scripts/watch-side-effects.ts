import chokidar from "chokidar";
import path from "node:path";
import {
  sideEffectExtensions,
  srcRoot,
  syncSideEffects,
} from "./sync-side-effects";

syncSideEffects();
console.log(`[watch-side-effects] synced side-effects from ${srcRoot}`);

let timeout: NodeJS.Timeout | undefined;
const scheduleSync = (event: string, filePath: string) => {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    syncSideEffects();
    console.log(
      `[watch-side-effects] synced side-effect files after ${event}: ${path.relative(srcRoot, filePath)}`,
    );
  }, 50);
};

const watcher = chokidar.watch(srcRoot, {
  ignored: (filePath, stats) =>
    stats?.isFile()
      ? !sideEffectExtensions.some((ext) => filePath.endsWith(ext))
      : false,
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
    console.log(
      `[watch-side-effects] watching ${srcRoot} for side-effect files`,
    );
  })
  .on("error", (error) => {
    console.error("[watch-side-effects] watcher error", error);
    process.exitCode = 1;
  });
