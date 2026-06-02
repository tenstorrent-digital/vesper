import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { DesignTokenTree, parseDesignTokenTree } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getLeadingTokens = () => {
  const spacingJSON: DesignTokenTree<number> = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../assets/tokens/Leading.tokens.json"),
      "utf-8",
    ),
  );

  return parseDesignTokenTree({
    tree: spacingJSON,
    processToken: (name, token) => [name.toLowerCase(), `${token.$value}%`],
  });
};
