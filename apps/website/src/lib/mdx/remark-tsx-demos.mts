/**
 * remark plugin that renders a document's component demos
 *
 * every ` ```tsx demo ` code block in `docs/**` is extracted into a real module
 * by `apps/website/scripts/generate-demos.ts`, and this plugin imports that
 * module back into the document, rendering the component the block exports
 * right above the block itself
 *
 * so a demo and the code shown for it can never drift apart, and a demo that
 * needs state or event handlers no longer has to be hand written as a client
 * component in `src/demos/` and wired up in `src/mdx-components.tsx`
 *
 * a demo is written as the source of a component (rather than as loose JSX) so
 * the same code block still reads as a complete, copyable example on github,
 * where it is only ever a code block
 *
 * @see `src/lib/mdx/demos.mts` - where a demo's module is generated to
 */

import type { Nodes, Root, RootContent } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { MdxjsEsm } from "mdast-util-mdxjs-esm";
import path from "node:path";
import type { Transformer } from "unified";

import { demoModulePath, isDemoCodeBlock } from "./demos.mts";

/**
 * name the nth demo of a document is imported under
 *
 * capitalised so MDX compiles `<TsxDemo0 />` to the component it was imported
 * as rather than to an `<tsxdemo0>` element, and prefixed so it can not
 * collide with a component a document imports or uses itself
 */
const demoName = (index: number): string => `TsxDemo${index}`;

/** how a demo's module is imported, relative to the document importing it */
const demoSpecifier = (docPath: string, modulePath: string): string => {
  const relativePath = path
    .relative(path.dirname(docPath), modulePath)
    .split(path.sep)
    .join("/");

  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
};

/**
 * `import <name> from "<source>"` as a module-scope MDX node
 *
 * MDX compiles these from `data.estree` rather than from `value` (which is
 * only kept for stringifying the tree back to MDX), so the import is built as
 * both
 */
const demoImport = (name: string, source: string): MdxjsEsm => ({
  type: "mdxjsEsm",
  value: `import ${name} from ${JSON.stringify(source)};`,
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
              local: { type: "Identifier", name },
            },
          ],
          source: { type: "Literal", value: source },
          attributes: [],
        },
      ],
    },
  },
});

/** `<name />` as a JSX element node */
const demoElement = (name: string): MdxJsxFlowElement => ({
  type: "mdxJsxFlowElement",
  name,
  attributes: [],
  children: [],
});

export default function remarkTsxDemos(): Transformer<Root> {
  return (tree, file) => {
    // documents outside the monorepo root `docs/` folder have no demos
    if (!demoModulePath(file.path, 0)) return;

    const imports: MdxjsEsm[] = [];

    /**
     * the demo for the nth demo code block in the document
     *
     * its module is imported without checking that it exists: `generate:demos`
     * runs before `dev` and `build` (see `apps/website/turbo.jsonc`), and while
     * `dev` is running the module for a demo that was just written lands a
     * moment after the document that added it - the bundler resolves the import
     * again as soon as it does, where dropping the demo here would leave it
     * missing until the document changed again
     */
    const demoFor = (index: number): MdxJsxFlowElement | null => {
      const modulePath = demoModulePath(file.path, index);
      if (!modulePath) return null;

      const name = demoName(index);
      imports.push(demoImport(name, demoSpecifier(file.path, modulePath)));

      return demoElement(name);
    };

    /**
     * walk the tree depth first, inserting each demo before the code block it
     * was extracted from
     *
     * a code block is always a leaf, so visiting a node's children before the
     * node itself still reaches demos in document order - the order
     * `generate-demos.ts` numbers them in - even for blocks nested inside
     * lists or JSX elements
     */
    const injectDemos = (node: Nodes): void => {
      if (!("children" in node)) return;

      const children: RootContent[] = [];

      node.children.forEach((child) => {
        injectDemos(child);

        if (child.type === "code" && isDemoCodeBlock(child.lang, child.meta)) {
          // one import is added per demo, so its count is the demo's number
          const demo = demoFor(imports.length);
          if (demo) children.push(demo);
        }

        children.push(child);
      });

      node.children = children as typeof node.children;
    };

    injectDemos(tree);

    if (!imports.length) return;

    /**
     * imports go to the top of the document, after its frontmatter (which
     * `remark-mdx-frontmatter` reads from the tree, so it has to stay put)
     */
    const frontmatter = tree.children[0]?.type === "yaml" ? 1 : 0;
    tree.children.splice(frontmatter, 0, ...imports);
  };
}
