import type { Token } from "lightningcss";
import type {
  ConfigExtension,
  DefaultClassGroupIds,
  DefaultThemeGroupIds,
} from "tailwind-merge";

import { TOKEN_FILE_NAMES, TAILWIND_UTILITY_FILE_NAMES } from "./constants";
import {
  CUSTOM_UTILITY_CLASSGROUPS,
  EXTENDED_CLASSGROUPS,
  THEME_TOKEN_GROUP_UTILITIES,
} from "./tailwind-merge-config";

/** A token group name that a variable can be bucketed into. */
export type TokenGroupName = (typeof TOKEN_FILE_NAMES)[number];

/** A utility group name that a utility can be bucketed into. */
export type UtilityGroupName = (typeof TAILWIND_UTILITY_FILE_NAMES)[number];

type DefaultExtension = ConfigExtension<
  DefaultClassGroupIds,
  DefaultThemeGroupIds
>;

type DefaultTheme = NonNullable<
  NonNullable<DefaultExtension["extend"]>["theme"]
>;

type DefaultThemeProperty = keyof DefaultTheme;

/**
 * Any token group name that maps to a property in `tailwind-merge`'s
 * `extend.theme` configuration object.
 */
export type ThemeTokenGroup = Exclude<TokenGroupName, ClassGroupTokenGroup>;

/**
 * Any token group name that does **not** map to a property in `tailwind-merge`'s
 * `extend.theme` configuration object. These token group names require
 * per-property overrides under `extend.classGroup`.
 *
 * @see ./tailwind-merge-config.ts:31
 * */
export type ClassGroupTokenGroup = Exclude<
  TokenGroupName,
  DefaultThemeProperty
>;

/** The metatada of a tailwind utility class */
export type UtilityData = {
  /**
   * The name of the utility, without any delimiters.
   *
   * The `bg-vesper-dot-pattern-*` utility's name, for example, would be `bg-vesper-dot-pattern`.
   **/
  name: string;
  /** Whether the utility accepts an argument or not. */
  acceptsArgument: boolean;
};

/** The metadata of a vesper css variable */
export type TokenData = {
  /** The name of the variable, eg. `--vesper-color-background-primary` */
  name: string;
  /** The token group the variable belongs to, eg. `color` */
  group: TokenGroupName;
  /** The token's value within its group, eg. `background-primary` */
  value: string;
};

type TokenType<T extends Token["type"]> = {
  type: "token";
  value: Token & { type: T };
};

export type DelimiterToken = TokenType<"delim">;

export type IdentityToken = TokenType<"ident">;

export type AssertNever<T extends never> = T;

type ExtendedClassGroupIds =
  (typeof EXTENDED_CLASSGROUPS)[ClassGroupTokenGroup][number][0];

type CustomUtilityClassGroupIds =
  (typeof CUSTOM_UTILITY_CLASSGROUPS)[UtilityGroupName]["conflicts"][number];

type ThemeTokenClassGroupIds =
  (typeof THEME_TOKEN_GROUP_UTILITIES)[ThemeTokenGroup][number][1];

export type SampleClassGroupIds =
  | ExtendedClassGroupIds
  | CustomUtilityClassGroupIds
  | ThemeTokenClassGroupIds;
