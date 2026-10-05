import type { Token } from "lightningcss";
import type {
  ConfigExtension,
  DefaultClassGroupIds,
  DefaultThemeGroupIds,
} from "tailwind-merge";

import { TOKEN_FILE_NAMES, TAILWIND_UTILITY_FILE_NAMES } from "./constants";

export type TokenGroupName = (typeof TOKEN_FILE_NAMES)[number];

export type UtilityGroupName = (typeof TAILWIND_UTILITY_FILE_NAMES)[number];

type DefaultExtension = ConfigExtension<
  DefaultClassGroupIds,
  DefaultThemeGroupIds
>;

type DefaultTheme = NonNullable<
  NonNullable<DefaultExtension["extend"]>["theme"]
>;

type DefaultThemeProperty = keyof DefaultTheme;

export type ClassGroupTokenGroup = Exclude<
  TokenGroupName,
  DefaultThemeProperty
>;

export type UtilityData = {
  name: string;
  acceptsArgument: boolean;
};

export type ThemeTokenGroup = Exclude<TokenGroupName, ClassGroupTokenGroup>;

export type TokenData = { name: string; group: string; value: string };

export type TokenType<T extends Token["type"]> = {
  type: "token";
  value: Token & { type: T };
};

export type DelimiterToken = TokenType<"delim">;

export type IdentityToken = TokenType<"ident">;

export type AssertNever<T extends never> = T;
