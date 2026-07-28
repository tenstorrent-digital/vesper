import chokidar from "chokidar";
import path from "node:path";

import { srcRoot, syncCSS } from "./sync-css";

const initial = await syncCSS();
console.log(`[watch-css] synced ${initial.length} css file(s) from ${srcRoot}`);

let timeout: NodeJS.Timeout | undefined;
const scheduleSync = (event: string, filePath: string) => {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(async () => {
    const changed = await syncCSS();

    /**
     * `syncCSS` only writes files whose output actually changed, so an empty
     * list means the edit was cosmetic (whitespace, comments) and nothing
     * downstream needs to be invalidated
     */
    if (changed.length === 0) {
      return;
    }

    console.log(
      `[watch-css] synced ${changed.length} css file(s) after ${event}: ${path.relative(srcRoot, filePath)}`,
    );
  }, 50);
};

const watcher = chokidar.watch(srcRoot, {
  ignored: (filePath, stats) =>
    stats?.isFile() ? !filePath.endsWith(".css") : false,
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
    console.log(`[watch-css] watching ${srcRoot} for side-effect files`);
  })
  .on("error", (error) => {
    console.error("[watch-css] watcher error", error);
    process.exitCode = 1;
  });
