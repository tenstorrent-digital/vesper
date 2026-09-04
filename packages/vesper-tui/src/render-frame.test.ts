import { createElement } from "react";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { buildApplication } from "./build.js";
import { Panel, Stack } from "./components.js";
import { createApplication } from "./create.js";
import { renderToString } from "./terminal.js";

test("renders semantic React elements as terminal content", () => {
  const output = renderToString(
    createElement(
      Panel,
      { title: "Dream" },
      createElement(
        Stack,
        { gap: 1 },
        createElement("h1", null, "Moon garden"),
        createElement("input", {
          "aria-label": "Title",
          value: "Flying",
        }),
        createElement("button", null, "Save"),
      ),
    ),
    { width: 40 },
  );

  assert.match(output, /┌ Dream /);
  assert.match(output, /Moon garden/);
  assert.match(output, /Title: Flying/);
  assert.match(output, /\[ Save \]/);
});

test("creates a self-contained TypeScript starter", async () => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "vesper-tui-create-"));
  const applicationRoot = join(temporaryRoot, "night-notes");

  try {
    await createApplication(applicationRoot);
    const packageJson = JSON.parse(
      await readFile(join(applicationRoot, "package.json"), "utf8"),
    ) as { scripts: { build: string; dev: string } };
    const source = await readFile(
      join(applicationRoot, "src/main.tsx"),
      "utf8",
    );

    assert.equal(
      packageJson.scripts.build,
      "vesper-tui build src/main.tsx --outfile dist/night-notes.cjs",
    );
    assert.equal(packageJson.scripts.dev, "vesper-tui dev src/main.tsx");
    assert.match(source, /@tenstorrent\/vesper\/button/);
  } finally {
    await rm(temporaryRoot, { force: true, recursive: true });
  }
});

test("builds a portable Node command", async () => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "vesper-tui-build-"));
  const entry = join(temporaryRoot, "main.ts");
  const outfile = join(temporaryRoot, "app.cjs");

  try {
    await import("node:fs/promises").then(({ writeFile }) =>
      writeFile(entry, 'process.stdout.write("hello from tui\\\\n");\n'),
    );
    await buildApplication({
      cwd: temporaryRoot,
      entry,
      logLevel: "silent",
      outfile,
    });
    const output = await readFile(outfile, "utf8");

    assert.match(output, /^#!\/usr\/bin\/env node/);
    assert.match(output, /hello from tui/);
  } finally {
    await rm(temporaryRoot, { force: true, recursive: true });
  }
});
