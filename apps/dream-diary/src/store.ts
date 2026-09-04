import { randomUUID } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

export interface Dream {
  createdAt: string;
  id: string;
  notes: string;
  title: string;
}

export interface NewDream {
  notes: string;
  title: string;
}

export const DEFAULT_DREAMS_FILE = join(
  homedir(),
  ".dream-diary",
  "dreams.json",
);

export function loadDreams(file = DEFAULT_DREAMS_FILE): Dream[] {
  try {
    const value: unknown = JSON.parse(readFileSync(file, "utf8"));
    return Array.isArray(value) ? value.filter(isDream) : [];
  } catch (error) {
    if (isMissingFileError(error)) return [];
    throw error;
  }
}

export function addDream(
  dreams: Dream[],
  input: NewDream,
  file = DEFAULT_DREAMS_FILE,
): Dream[] {
  const nextDream: Dream = {
    createdAt: new Date().toISOString(),
    id: randomUUID(),
    notes: input.notes.trim(),
    title: input.title.trim(),
  };
  const nextDreams = [nextDream, ...dreams];
  writeDreams(nextDreams, file);
  return nextDreams;
}

export function writeDreams(
  dreams: Dream[],
  file = DEFAULT_DREAMS_FILE,
): void {
  mkdirSync(dirname(file), { recursive: true });
  const temporaryFile = `${file}.${process.pid}.tmp`;
  writeFileSync(temporaryFile, `${JSON.stringify(dreams, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  renameSync(temporaryFile, file);
}

function isDream(value: unknown): value is Dream {
  if (!value || typeof value !== "object") return false;
  const dream = value as Record<string, unknown>;
  return (
    typeof dream.id === "string" &&
    typeof dream.title === "string" &&
    typeof dream.notes === "string" &&
    typeof dream.createdAt === "string"
  );
}

function isMissingFileError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
