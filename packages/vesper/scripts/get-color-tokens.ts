import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { DesignTokenTree, parseDesignTokenTree } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEGACY_TOKENS = ["old--stoneA"];

type ColorTokenValue = {
  colorSpace: string;
  components: number[];
  alpha: number;
  hex: string;
};

const parseColorTokenTree = (tree: DesignTokenTree<ColorTokenValue>) =>
  parseDesignTokenTree({
    tree,
    processToken: (name, token) => {
      if (token.$value.alpha === 0) {
        return [name, "transparent"];
      }

      if (token.$value.alpha < 1) {
        const rgba = token.$value.components
          .map((c) => Math.round(c * 255))
          .concat(Number(token.$value.alpha.toFixed(3)));

        return [name, `rgba(${rgba.join(", ")})`];
      }

      return [name, token.$value.hex.toLowerCase()];
    },
    acceptToken: (tokenName) =>
      !LEGACY_TOKENS.some((legacy) => tokenName.includes(legacy)),
  });

export const getColorTokens = () => {
  const darkJSON: DesignTokenTree<ColorTokenValue> = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../assets/tokens/Dark.tokens.json"),
      "utf-8",
    ),
  );

  const lightJSON: DesignTokenTree<ColorTokenValue> = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../assets/tokens/Light.tokens.json"),
      "utf-8",
    ),
  );

  const dark = parseColorTokenTree(darkJSON);
  const light = parseColorTokenTree(lightJSON);

  return { dark, light };
};
