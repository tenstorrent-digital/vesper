/**
 * Remark plugin that renders a document's component demos
 *
 * Every `tsx demo` code block in `docs/**` is extracted into a real module
 *
 * That module then gets imported back into the document, rendering the
 * component the block exports right above the block itself
 *
 * The modules themselves are written by `scripts/generate-demos.mts` before
 * next is started, because next resolves the imports added here against the
 * filesystem as it was when the build began (see the script for details)
 */

import type { Root, RootContent } from "mdast";
import type { MdxjsEsm } from "mdast-util-mdxjs-esm";
import path from "node:path";
import type { Transformer } from "unified";

import {
  createOrUpdateFile,
  getDemoModulePath,
  getDemoModuleSource,
  isDemoCodeBlock,
} from "./tsx-demos.mts";

export default function remarkTsxDemos(): Transformer<Root> {
  return async (tree, file) => {
    // Ignore files outside of `docs/`
    if (!getDemoModulePath(file.path, 0)) return;

    /** Array of MDX ESM import statements that bring the demos into scope */
    const demoImportStatements: MdxjsEsm[] = [];

    /** The document's nodes, with each demo inserted before its code block */
    const transformedChildren: RootContent[] = [];

    for (const child of tree.children) {
      // If the child is not a demo code block, only inject the child itself
      if (!isDemoCodeBlock(child)) {
        transformedChildren.push(child);
        continue;
      }

      // If the demo has no module path, only inject the child itself
      const demoModulePath = getDemoModulePath(
        file.path,
        demoImportStatements.length,
      );
      if (!demoModulePath) {
        transformedChildren.push(child);
        continue;
      }

      // Turn current demo index into a PascalCase component name, eg. "TsxDemo1"
      const demoName = `TsxDemo${demoImportStatements.length}`;

      /**
       * keep the module in sync while `next dev` is running, so a demo added
       * or edited in a document shows up without regenerating them by hand
       *
       * a build has already written every demo, so this is a no-op there
       */
      await createOrUpdateFile(demoModulePath, getDemoModuleSource(child));

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
    }

    // Assign the document its new children with injected demos
    tree.children = transformedChildren;

    // Inject imports at the top of the document, after frontmatter
    const hasFrontmatter = tree.children[0]?.type === "yaml";
    tree.children.splice(hasFrontmatter ? 1 : 0, 0, ...demoImportStatements);
  };
}
