import { transform, type TokenOrValue } from "lightningcss";
import fs from "node:fs";

import type {
  DelimiterToken,
  IdentityToken,
  TokenData,
  UtilityData,
  UtilityGroupName,
  TokenGroupName,
} from "./types";

import { resolvePackagePath } from "../utils";
import {
  TAILWIND_UTILITY_FILE_NAMES,
  TAILWIND_UTILITY_GROUPS,
  TOKEN_FILE_NAMES,
} from "./constants";

/**
 * Iterates over all of the utilit class names for a given utility group name
 * and returns the common prefix among them, prefixed with `"vesper."`
 *
 * We use this to create keys that correspond to our custom utilities when
 * defining class groups for our custom utilities in the tailwind merge config.
 *
 * @example
 * console.log(getVesperUtilityGroupId("dot-pattern"));
 * // "vesper.bg-vesper-dot-pattern"
 */
export const getVesperUtilityGroupId = (group: UtilityGroupName) => {
  const names = TAILWIND_UTILITY_GROUPS[group].map((u) => u.name);

  const [first = [], ...rest] = names.map((name) => name.split("-"));
  const length = first.findIndex((part, index) =>
    rest.some((parts) => parts[index] !== part),
  );

  /** longest common prefix of class names, by their dash-separated parts */
  const commonPrefix = first
    .slice(0, length === -1 ? undefined : length)
    .join("-");

  return `vesper.${commonPrefix}`;
};

const isIdentityToken = (t: TokenOrValue): t is IdentityToken =>
  t.type === "token" && t.value.type === "ident";

const isDelimiterToken = (t: TokenOrValue): t is DelimiterToken =>
  t.type === "token" && t.value.type === "delim";

/**
 * Returns a mapping of utility group names to a list of metadata about each
 * individual utility within that group.
 */
export const getTailwindUtilityGroups = (): Record<
  UtilityGroupName,
  UtilityData[]
> => {
  const utilities = Object.fromEntries<UtilityData[]>(
    TAILWIND_UTILITY_FILE_NAMES.map((group) => [group, []]),
  ) as Record<UtilityGroupName, UtilityData[]>;

  for (const group of TAILWIND_UTILITY_FILE_NAMES) {
    const filename = `./src/styles/tailwind-utilities/${group}.css` as const;
    const code = fs.readFileSync(resolvePackagePath(filename));

    transform({
      filename,
      code,
      visitor: {
        Rule(rule) {
          // ignore anything that is not a `@utility` rule
          if (rule.type !== "unknown" || rule.value.name !== "utility") return;

          /**
           * `rule.value.prelude` is an array of `IdentityToken`s and `DelimiterToken`s
           *
           * Delimiter tokens are represented by an asterisk (*), while identity tokens
           * are string literals that comprise the utility name.
           *
           * For example, `bg-vesper-dot-pattern-*` has two tokens:
           * 1. An identity token - `bg-vesper-dot-pattern-`
           * 2. A delimiter token - `*`
           *
           * We only care about the identity tokens when constructing the name of the
           * utility, so we filter out the delimiter tokens and eliminate any leading
           * or trailing dashes after joining the token values together.
           *
           * So the utility `bg-vesper-dot-pattern-*` has the name `bg-vesper-dot-pattern`
           */
          const name = rule.value.prelude
            .filter(isIdentityToken)
            .map((t) => t.value.value)
            .join("")
            .split("-")
            .filter(Boolean)
            .join("-");

          /**
           * A tailwind utility rule with at least one delimiter token accepts an
           * argument. For example, `bg-vesper-dot-pattern-*` accepts a vesper color
           * token as an argument:
           *
           * ```tsx
           * <div className="bg-vesper-dot-pattern-teal-800" />
           * ```
           */
          const acceptsArgument =
            rule.value.prelude.filter(isDelimiterToken).length > 0;

          utilities[group].push({ name, acceptsArgument });
        },
      },
    });
  }

  return utilities;
};

const VESPER_PREFIX = "--vesper-";

/**
 * Returns a mapping of token group names to a list of metadata about each
 * individual token within that group.
 */
export const getTokenVariableGroups = (): Record<
  TokenGroupName,
  TokenData[]
> => {
  const variables = Object.fromEntries<TokenData[]>(
    TOKEN_FILE_NAMES.map((group) => [group, []]),
  ) as Record<TokenGroupName, TokenData[]>;

  for (const group of TOKEN_FILE_NAMES) {
    const filename = `./src/styles/${group}.css` as const;
    const code = fs.readFileSync(resolvePackagePath(filename));

    transform({
      filename,
      code,
      visitor: {
        Declaration(declaration) {
          if (declaration.property === "custom") {
            // If the token name does not start with the vesper prefix, or
            // we have already seen it, ignore it
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
