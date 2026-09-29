import { transform } from "lightningcss";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN_GROUPS = [
  "color",
  "font",
  "leading",
  "radius",
  "shadow",
  "spacing",
  "tracking",
  "transition-duration",
  "border-width",
  "outline-width",
] as const;

const VESPER_PREFIX = "--vesper-";

export type TokenGroup = (typeof TOKEN_GROUPS)[number];

type TokenData = { name: string; group: string; value: string };

export const getTokenVariableGroups = (): Record<TokenGroup, TokenData[]> => {
  const variables = Object.fromEntries<TokenData[]>(
    TOKEN_GROUPS.map((group) => [group, []])
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
            const name = declaration.value.name;
            if (
              !name.startsWith(VESPER_PREFIX) ||
              variables[group].some((v) => v.name === name)
            ) {
              return;
            }

            variables[group].push({
              name,
              group,
              value: name.slice(VESPER_PREFIX.length + group.length + 1),
            });
          }
        },
      },
    });
  }

  return variables;
};
