import { Token, TokenOrValue, transform } from "lightningcss";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UTILITY_GROUPS = ["dot-pattern"] as const;

export type UtilityGroup = (typeof UTILITY_GROUPS)[number];

type TokenType<T extends Token["type"]> = {
  type: "token";
  value: Token & { type: T };
};

type DelimiterToken = TokenType<"delim">;

type IdentityToken = TokenType<"ident">;

const isIdentityToken = (t: TokenOrValue): t is IdentityToken =>
  t.type === "token" && t.value.type === "ident";

const isDelimiterToken = (t: TokenOrValue): t is DelimiterToken =>
  t.type === "token" && t.value.type === "delim";

type UtilityData = {
  name: string;
  properties: string[];
  acceptsArgument: boolean;
};

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
            .filter(isIdentityToken)
            .map((t) => t.value.value)
            .join("")
            .split("-")
            .filter(Boolean)
            .join("-");

          const properties = (rule.value.block ?? [])
            .filter(isIdentityToken)
            .map((token) => token.value.value);

          const acceptsArgument =
            rule.value.prelude.filter(isDelimiterToken).length > 0;

          utilities[group].push({ name, properties, acceptsArgument });
        },
      },
    });
  }

  return utilities;
};
