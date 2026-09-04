#!/usr/bin/env node

import { relative } from "node:path";

import { buildApplication, devApplication } from "./build.js";
import { createApplication } from "./create.js";

const HELP = `vesper-tui

Create, build, and preview React applications in a terminal.

Usage:
  vesper-tui create <directory>
  vesper-tui build [entry] [--outfile <file>] [--sourcemap] [--no-minify]
  vesper-tui dev [entry]
  vesper-tui --help

Defaults:
  entry       src/main.tsx
  outfile     dist/app
`;

async function main(args: string[]): Promise<void> {
  const [command, ...rest] = args;
  if (!command || command === "--help" || command === "-h") {
    process.stdout.write(HELP);
    return;
  }

  if (command === "create") {
    const destination = rest[0];
    if (!destination || rest.length > 1) {
      throw new Error("Usage: vesper-tui create <directory>");
    }
    const root = await createApplication(destination);
    process.stdout.write(
      `Created ${relative(process.cwd(), root)}. Run your package manager, then start with the dev script.\n`,
    );
    return;
  }

  if (command === "dev") {
    if (rest.some((argument) => argument.startsWith("-"))) {
      throw new Error("Usage: vesper-tui dev [entry]");
    }
    await devApplication({ entry: rest[0] ?? "src/main.tsx" });
    return;
  }

  if (command === "build") {
    const options = parseBuildArguments(rest);
    const output = await buildApplication(options);
    process.stdout.write(`Built ${relative(process.cwd(), output)}\n`);
    return;
  }

  throw new Error(`Unknown command "${command}".\n\n${HELP}`);
}

function parseBuildArguments(args: string[]) {
  let entry = "src/main.tsx";
  let outfile = "dist/app";
  let minify = true;
  let sourcemap = false;
  let hasEntry = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--outfile" || argument === "-o") {
      const value = args[index + 1];
      if (!value) throw new Error(`${argument} requires a file path`);
      outfile = value;
      index += 1;
    } else if (argument === "--sourcemap") {
      sourcemap = true;
    } else if (argument === "--no-minify") {
      minify = false;
    } else if (argument?.startsWith("-")) {
      throw new Error(`Unknown option "${argument}"`);
    } else if (!hasEntry && argument) {
      entry = argument;
      hasEntry = true;
    } else {
      throw new Error(`Unexpected argument "${argument}"`);
    }
  }

  return { entry, outfile, minify, sourcemap };
}

main(process.argv.slice(2)).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`vesper-tui: ${message}\n`);
  process.exitCode = 1;
});
