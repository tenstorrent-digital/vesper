import { Token, TokenOrValue, transform } from "lightningcss";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UTILITY_GROUPS = ["dot-pattern"] as const;

export type UtilityGroup = (typeof UTILITY_GROUPS)[number];

type DelimiterToken = { type: "token"; value: Token & { type: "delim" } };

type IdentityToken = { type: "token"; value: Token & { type: "ident" } };

type PreludeToken = DelimiterToken | IdentityToken;

type UtilityData = string;

const isIdentityToken = (t: TokenOrValue): t is IdentityToken =>
  t.type === "token" && t.value.type === "ident";

const isDelimiterToken = (t: TokenOrValue): t is IdentityToken =>
  t.type === "token" && t.value.type === "delim";

const isIdentityOrDelimiterToken = (t: TokenOrValue): t is PreludeToken =>
  isIdentityToken(t) || isDelimiterToken(t);

export const getTailwindUtilityGroups = (): Record<
  UtilityGroup,
  UtilityData[]
> => {
  const utilities = Object.fromEntries<UtilityData[]>(
    UTILITY_GROUPS.map((group) => [group, []]),
  ) as Record<UtilityGroup, UtilityData[]>;

  for (const group of UTILITY_GROUPS) {
    const filename = `src/styles/tailwind-utilities/${group}.css`;
    const code = fs.readFileSync(path.resolve(__dirname, "..", filename));

    transform({
      filename,
      code,
      visitor: {
        Rule(rule) {
          if (rule.type !== "unknown" || rule.value.name !== "utility") return;

          const name = rule.value.prelude
            .filter(isIdentityOrDelimiterToken)
            .map((t) => t.value.value)
            .join("");

          utilities[group].push(name);
        },
      },
    });
  }

  return utilities;
};
