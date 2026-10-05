import { transform, type TokenOrValue } from "lightningcss";
import fs from "node:fs";

import type {
  DelimiterToken,
  IdentityToken,
  TokenData,
  UtilityData,
  UtilityGroupName,
  VariableGroupName,
} from "./types";

import { resolvePackagePath } from "../utils";
import {
  TW_UTILITY_FILE_NAMES,
  TW_UTILITY_GROUPS,
  VARIABLE_FILE_NAMES,
} from "./constants";

export const getVesperUtilityGroupId = (group: UtilityGroupName) => {
  const names = TW_UTILITY_GROUPS[group].map((u) => u.name);

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

export const getTailwindUtilityGroups = (): Record<
  UtilityGroupName,
  UtilityData[]
> => {
  const utilities = Object.fromEntries<UtilityData[]>(
    TW_UTILITY_FILE_NAMES.map((group) => [group, []]),
  ) as Record<UtilityGroupName, UtilityData[]>;

  for (const group of TW_UTILITY_FILE_NAMES) {
    const filename = `./src/styles/tailwind-utilities/${group}.css` as const;
    const code = fs.readFileSync(resolvePackagePath(filename));

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

const VESPER_PREFIX = "--vesper-";

export const getTokenVariableGroups = (): Record<
  VariableGroupName,
  TokenData[]
> => {
  const variables = Object.fromEntries<TokenData[]>(
    VARIABLE_FILE_NAMES.map((group) => [group, []]),
  ) as Record<VariableGroupName, TokenData[]>;

  for (const group of VARIABLE_FILE_NAMES) {
    const filename = `./src/styles/${group}.css` as const;
    const code = fs.readFileSync(resolvePackagePath(filename));

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
