import { run } from "vesper-tui";

import { DreamDiary } from "./app.js";

run(<DreamDiary />).catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
