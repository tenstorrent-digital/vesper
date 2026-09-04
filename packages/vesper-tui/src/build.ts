import {
  build,
  type BuildOptions as EsbuildOptions,
  context,
  type Plugin,
} from "esbuild";
import { type ChildProcess,spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { chmod, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";

export interface BuildApplicationOptions {
  cwd?: string;
  development?: boolean;
  entry: string;
  logLevel?: EsbuildOptions["logLevel"];
  minify?: boolean;
  outfile: string;
  sourcemap?: boolean;
}

export async function buildApplication({
  cwd = process.cwd(),
  development = false,
  entry,
  logLevel = "info",
  minify = !development,
  outfile,
  sourcemap = development,
}: BuildApplicationOptions): Promise<string> {
  const absoluteOutput = resolve(cwd, outfile);
  await mkdir(dirname(absoluteOutput), { recursive: true });
  await build(
    createBuildOptions({
      cwd,
      development,
      entry,
      logLevel,
      minify,
      outfile: absoluteOutput,
      sourcemap,
    }),
  );
  await chmod(absoluteOutput, 0o755);
  return absoluteOutput;
}

export async function devApplication({
  cwd = process.cwd(),
  entry,
}: Pick<BuildApplicationOptions, "cwd" | "entry">): Promise<void> {
  const key = createHash("sha256")
    .update(`${cwd}:${entry}`)
    .digest("hex")
    .slice(0, 12);
  const outfile = resolve(tmpdir(), `vesper-tui-${key}.cjs`);
  let child: ChildProcess | undefined;
  let restarting = Promise.resolve();
  let stopping = false;

  const stopChild = async () => {
    const runningChild = child;
    if (!runningChild || runningChild.exitCode !== null) return;
    await new Promise<void>((resolveExit) => {
      const timeout = setTimeout(() => runningChild.kill("SIGKILL"), 1_000);
      runningChild.once("exit", () => {
        clearTimeout(timeout);
        resolveExit();
      });
      runningChild.kill("SIGTERM");
    });
  };

  const restartPlugin: Plugin = {
    name: "vesper-tui-preview",
    setup(builder) {
      builder.onEnd((result) => {
        if (result.errors.length > 0 || stopping) return;
        restarting = restarting.then(async () => {
          await stopChild();
          if (stopping) return;
          process.stderr.write("[vesper-tui] preview ready\n");
          const nextChild = spawn(process.execPath, [outfile], {
            cwd,
            stdio: "inherit",
          });
          child = nextChild;
          nextChild.once("exit", () => {
            if (!stopping && child === nextChild) {
              child = undefined;
              process.stderr.write(
                "[vesper-tui] preview closed; waiting for changes (Ctrl+C to stop)\n",
              );
            }
          });
        });
      });
    },
  };

  const buildContext = await context({
    ...createBuildOptions({
      cwd,
      development: true,
      entry,
      logLevel: "info",
      minify: false,
      outfile,
      sourcemap: true,
    }),
    plugins: [restartPlugin],
  });

  process.stderr.write("[vesper-tui] watching for changes\n");
  await buildContext.watch();
  await new Promise<void>((resolveExit) => {
    const stop = () => resolveExit();
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  });

  stopping = true;
  await stopChild();
  await restarting;
  await buildContext.dispose();
  await Promise.all([
    rm(outfile, { force: true }),
    rm(`${outfile}.map`, { force: true }),
  ]);
}

function createBuildOptions({
  cwd,
  development,
  entry,
  logLevel,
  minify,
  outfile,
  sourcemap,
}: Required<BuildApplicationOptions>): EsbuildOptions {
  return {
    absWorkingDir: cwd,
    banner: { js: "#!/usr/bin/env node" },
    bundle: true,
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        development ? "development" : "production",
      ),
    },
    entryPoints: [resolve(cwd, entry)],
    format: "cjs",
    jsx: "automatic",
    legalComments: "none",
    logLevel,
    minify,
    outfile,
    platform: "node",
    sourcemap,
    target: "node22",
  };
}
