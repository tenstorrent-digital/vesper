import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { addDream, loadDreams } from "./store.js";

test("records and reloads dreams", () => {
  const directory = mkdtempSync(join(tmpdir(), "dream-diary-"));
  const file = join(directory, "dreams.json");

  try {
    const dreams = addDream(
      [],
      { notes: "I could breathe underwater.", title: "The blue city" },
      file,
    );
    assert.equal(dreams.length, 1);
    assert.deepEqual(loadDreams(file), dreams);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
});

test("ignores invalid records while loading", () => {
  const directory = mkdtempSync(join(tmpdir(), "dream-diary-"));
  const file = join(directory, "dreams.json");

  try {
    writeFileSync(
      file,
      JSON.stringify([
        { id: "incomplete", title: "Missing fields" },
        {
          createdAt: "2026-09-03T23:22:38.924Z",
          id: "valid",
          notes: "A quiet observatory.",
          title: "Stars",
        },
      ]),
    );
    assert.deepEqual(loadDreams(file).map((dream) => dream.id), ["valid"]);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
});
