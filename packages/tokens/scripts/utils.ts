export type DesignToken<T> = {
  $value: T;
};

export type DesignTokenTree<T> =
  | DesignToken<T>
  | { [key: string]: DesignToken<T> };

const isDesignToken = <T>(value: DesignTokenTree<T>): value is DesignToken<T> =>
  "$value" in value;

export const parseDesignTokenTree = <T, R>(
  tree: DesignTokenTree<T>,
  processToken: (
    name: string,
    token: DesignToken<T>,
  ) => [name: string, value: R],
  filterToken = (() => true) as (tokenName: string) => boolean,
  tokenPrefix = "",
) => {
  const tokens: [name: string, value: R][] = [];

  const createTokens = (tree: DesignTokenTree<T>, tokenName = tokenPrefix) => {
    if (isDesignToken(tree)) {
      tokens.push(processToken(tokenName, tree));
      return;
    }

    Object.entries(tree).forEach(([tokenPart, tree]) => {
      if (tokenPart.startsWith("$")) return;
      createTokens(tree, tokenName ? `${tokenName}-${tokenPart}` : tokenPart);
    });
  };
  createTokens(tree);

  return Object.fromEntries(tokens.filter((entry) => filterToken(entry[0])));
};
