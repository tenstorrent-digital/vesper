import type { Nodes, Root, RootContent } from "mdast";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Transformer } from "unified";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const demosRoot = path.resolve(__dirname, "../../generated-demos");
const docsRoot = path.resolve(__dirname, "../../../../../docs");

export default function remarkTsxDemos(): Transformer<Root> {
  return (node, file) => {
    if (!file.path.startsWith(docsRoot) || !file.path.endsWith(".mdx")) {
      return;
    }

    const generatedDemosFolder =
      demosRoot + path.dirname(file.path).slice(docsRoot.length);

    const docName = file.path
      .split("/")
      .find((segment) => segment.endsWith(".mdx"))!
      .slice(0, -4);

    let demoIndex = -1;

    const visit = (node: Nodes): void => {
      if ("children" in node) node.children.forEach(visit);

      const isComponentDemo =
        node.type === "code" && node.lang === "tsx" && node.meta === "demo";

      if (isComponentDemo) {
        demoIndex++;

        const demoLocation = path.join(
          generatedDemosFolder,
          `${docName}-${demoIndex}.tsx`
        );

        // do something with the demo
      }
    };

    visit(node);
  };
}
