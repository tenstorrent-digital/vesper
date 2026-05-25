import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ColorToken = {
  $value: {
    colorSpace: string;
    components: number[];
    alpha: number;
    hex: string;
  };
};

type ColorTokenTree = ColorToken | { [key: string]: ColorTokenTree };

const isColorToken = (tree: ColorTokenTree): tree is ColorToken =>
  "$value" in tree;

const parseColorTokenTree = (tree: ColorTokenTree, tokenPrefix = "") => {
  const colors: [name: string, value: string][] = [];

  const createTokens = (tree: ColorTokenTree, tokenName = tokenPrefix) => {
    if (isColorToken(tree)) {
      if (tree.$value.alpha === 0) {
        colors.push([tokenName, "transparent"]);
        return;
      }

      if (tree.$value.alpha < 1) {
        const rgba = tree.$value.components
          .map((c) => Math.round(c * 255))
          .concat(Number(tree.$value.alpha.toFixed(3)));
        colors.push([tokenName, `rgba(${rgba.join(", ")})`]);
        return;
      }

      colors.push([tokenName, tree.$value.hex.toLowerCase()]);
      return;
    }

    Object.entries(tree).forEach(([tokenPart, tree]) => {
      if (tokenPart.startsWith("$")) return;
      createTokens(tree, tokenName ? `${tokenName}-${tokenPart}` : tokenPart);
    });
  };
  createTokens(tree);

  return Object.fromEntries(colors);
};

const darkJSON: ColorTokenTree = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../assets/colors/Dark.tokens.json"),
    "utf-8",
  ),
);

const lightJSON: ColorTokenTree = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../assets/colors/Light.tokens.json"),
    "utf-8",
  ),
);

const darkTokens = parseColorTokenTree(darkJSON);
const lightTokens = parseColorTokenTree(lightJSON);
const tokensObj = {
  dark: darkTokens,
  light: lightTokens,
};

fs.writeFileSync(
  path.resolve(__dirname, "../src/colors.ts"),
  `export const colors = ${JSON.stringify(tokensObj)}`,
);
