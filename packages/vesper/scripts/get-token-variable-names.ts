import { transform } from "lightningcss";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN_GROUPS = [
  "colors",
  "fonts",
  "leading",
  "radius",
  "shadows",
  "spacing",
  "tracking",
  "animation",
  "backgrounds",
  "strokes",
] as const;

const VAR_PREFIX = "--vesper-";

type TokenGroup = (typeof TOKEN_GROUPS)[number];

type TokenData = { name: string; parts: string[] };

export const getTokenVariableNames = (): Record<TokenGroup, TokenData[]> => {
  const variables = Object.fromEntries<TokenData[]>(
    TOKEN_GROUPS.map((group) => [group, []]),
  ) as Record<TokenGroup, TokenData[]>;

  for (const group of TOKEN_GROUPS) {
    const filename = `src/styles/${group}.css`;
    const code = fs.readFileSync(path.resolve(__dirname, "..", filename));

    transform({
      filename,
      code,
      visitor: {
        Declaration(declaration) {
          if (declaration.property === "custom") {
            let name = declaration.value.name;
            if (!name.startsWith(VAR_PREFIX)) return;

            name = name.slice(VAR_PREFIX.length);
            if (variables[group].some((v) => v.name === name)) return;

            const parts = name.split("-");
            variables[group].push({ name, parts });
          }
        },
      },
    });
  }

  return variables;
};
