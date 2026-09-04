import { mkdir, readdir, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

export async function createApplication(
  destination: string,
  cwd = process.cwd(),
): Promise<string> {
  const root = resolve(cwd, destination);
  const packageName = basename(root);
  if (!/^[a-z0-9][a-z0-9-_]*$/.test(packageName)) {
    throw new Error(
      "Application names must contain only lowercase letters, numbers, hyphens, and underscores.",
    );
  }

  await mkdir(root, { recursive: true });
  if ((await readdir(root)).length > 0) {
    throw new Error(`Cannot create an application in non-empty directory: ${root}`);
  }
  await mkdir(resolve(root, "src"));

  await Promise.all([
    writeFile(
      resolve(root, "package.json"),
      `${JSON.stringify(
        {
          name: packageName,
          version: "0.1.0",
          private: true,
          type: "module",
          scripts: {
            build: `vesper-tui build src/main.tsx --outfile dist/${packageName}.cjs`,
            dev: "vesper-tui dev src/main.tsx",
            "check-types": "tsc --noEmit",
          },
          dependencies: {
            "@tenstorrent/vesper": "^0.1.0",
            react: "^19.2.0",
            "react-dom": "^19.2.0",
            "vesper-tui": "^0.1.0",
          },
          devDependencies: {
            "@types/node": "^22.0.0",
            "@types/react": "^19.2.0",
            typescript: "^5.9.0",
          },
          engines: {
            node: ">=22",
          },
        },
        null,
        2,
      )}\n`,
    ),
    writeFile(
      resolve(root, "tsconfig.json"),
      `${JSON.stringify(
        {
          compilerOptions: {
            esModuleInterop: true,
            jsx: "react-jsx",
            lib: ["ES2022", "DOM"],
            module: "NodeNext",
            moduleResolution: "NodeNext",
            noEmit: true,
            strict: true,
            target: "ES2022",
          },
          include: ["src"],
        },
        null,
        2,
      )}\n`,
    ),
    writeFile(resolve(root, "src/main.tsx"), starterSource(packageName)),
    writeFile(
      resolve(root, "README.md"),
      `# ${packageName}\n\nRun \`yarn install\`, then \`yarn dev\` for a live terminal preview or \`yarn build\` for an installable command.\n`,
    ),
  ]);

  return root;
}

function starterSource(name: string): string {
  return `import { useState } from "react";

import { Button } from "@tenstorrent/vesper/button";
import { Typography } from "@tenstorrent/vesper/typography";
import { Panel, Stack, run } from "vesper-tui";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Panel title="${name}">
      <Stack gap={1}>
        <Typography as="h1" variant="heading-lg">
          Hello from Vesper TUI
        </Typography>
        <Typography>You pressed the button {count} times.</Typography>
        <Button onClick={() => setCount((value) => value + 1)}>
          Count
        </Button>
      </Stack>
    </Panel>
  );
}

run(<App />).catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
`;
}
