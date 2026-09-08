/**
 * Remark plugin that renders a document's component demos
 *
 * Every `tsx demo` code block in `docs/**` is extracted into a real module
 * by `apps/website/scripts/generate-demos.ts`, and this plugin imports that
 * module back into the document, rendering the component the block exports
 * right above the block itself
 *
 * @see `src/lib/mdx/demos.mts` - where a demo's module is generated to
 */

import type { Nodes, Root, RootContent } from "mdast";
import type { MdxjsEsm } from "mdast-util-mdxjs-esm";
import path from "node:path";
import type { Transformer } from "unified";

import { getDemoModulePath, isDemoCodeBlock } from "./demos.mts";

export default function remarkTsxDemos(): Transformer<Root> {
  return (tree, file) => {
    // Files with no demos can be skipped
    if (!getDemoModulePath(file.path, 0)) return;

    /** Array of MDX ESM import statements that bring the demos into scope */
    const demoImportStatements: MdxjsEsm[] = [];

    /**
     * walk the tree depth first, inserting each demo before
     * the code block it was extracted from
     */
    const injectDemos = (node: Nodes): void => {
      if (!("children" in node)) return;

      const transformedChildren: RootContent[] = [];

      node.children.forEach((child) => {
        injectDemos(child);

        // If the child is not a demo code block, only inject the child itself
        if (!isDemoCodeBlock(child)) {
          transformedChildren.push(child);
          return;
        }

        // If the demo has no module path, only inject the child itself
        const demoModulePath = getDemoModulePath(
          file.path,
          demoImportStatements.length,
        );
        if (!demoModulePath) {
          transformedChildren.push(child);
          return;
        }

        // Turn current demo index into a PascalCase component name, eg. "TsxDemo1"
        const demoName = `TsxDemo${demoImportStatements.length}`;

        // Get the relative import path for the demo component's module
        let demoImportPath = path
          .relative(path.dirname(file.path), demoModulePath)
          .split(path.sep)
          .join("/");
        if (!demoImportPath.startsWith(".")) {
          demoImportPath = `./${demoImportPath}`;
        }

        // Create a MDX ESM import declaration node for the demo component
        const importNode: MdxjsEsm = {
          type: "mdxjsEsm",
          value: `import ${demoName} from "${demoImportPath}";`,
          data: {
            estree: {
              type: "Program",
              sourceType: "module",
              body: [
                {
                  type: "ImportDeclaration",
                  specifiers: [
                    {
                      type: "ImportDefaultSpecifier",
                      local: { type: "Identifier", name: demoName },
                    },
                  ],
                  source: { type: "Literal", value: demoImportPath },
                  attributes: [],
                },
              ],
            },
          },
        };
        // Add the import node to the array of demo import statements
        demoImportStatements.push(importNode);

        // Inject the rendered demo component before its code block node
        transformedChildren.push(
          {
            type: "mdxJsxFlowElement",
            name: demoName,
            attributes: [],
            children: [],
          },
          child,
        );
      });

      // Assign the node its new children with injected demos
      node.children = transformedChildren;
    };

    injectDemos(tree);

    // Inject imports at the top of the document, after frontmatter
    const hasFrontmatter = tree.children[0]?.type === "yaml";
    tree.children.splice(hasFrontmatter ? 1 : 0, 0, ...demoImportStatements);
  };
}
