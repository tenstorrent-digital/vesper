import { PlopTypes } from "@turbo/gen";
import autocomplete from "inquirer-autocomplete-prompt";

import {
  COMPONENTS_PATH,
  getComponentChoices,
  searchComponentChoices,
  addToMdxComponents,
} from "./lib/helpers";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // register autocomplete prompt type
  plop.setPrompt("autocomplete", autocomplete);

  plop.setGenerator("vesper-component", {
    description: "Creates a new component in the vesper package",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the new component to create?",
        validate: (input: string) => {
          if (!/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/.test(input)) {
            return "component name must be PascalCase";
          }
          if (!input) {
            return "component name is required";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "element",
        message: "What is the root element for this component? (optional)",
      },
    ],
    actions: [
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/vesper/src/components/{{ kebabCase name }}/{{ kebabCase name }}.tsx",
        templateFile: "templates/react-component.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/vesper/src/components/{{ kebabCase name }}/{{ kebabCase name }}.css",
        template: ".vesper-{{ kebabCase name }} {\n}",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/vesper/src/components/{{ kebabCase name }}/{{ kebabCase name }}.test.tsx",
        templateFile: "templates/react-component.test.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/vesper/src/components/{{ kebabCase name }}/{{ kebabCase name }}.stories.tsx",
        templateFile: "templates/react-component.stories.hbs",
      },
      {
        type: "append",
        path: "{{ turbo.paths.root }}/packages/vesper/src/styles/styles.css",
        pattern: /\/\* components \*\//,
        template:
          '@import "../components/{{ kebabCase name }}/{{ kebabCase name }}.css" layer(vesper);',
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/packages/vesper/package.json",
        pattern: /"exports"\s*:\s*\{/,
        template: [
          `"exports": {`,
          `    "./{{ kebabCase name }}": {`,
          `      "types": "./dist/components/{{ kebabCase name }}/{{ kebabCase name }}.d.ts",`,
          `      "import": "./dist/components/{{ kebabCase name }}/{{ kebabCase name }}.js"`,
          `    },`,
        ].join("\n"),
      },
    ],
  });

  // setup autocomplete prompt w our components
  const componentChoices = getComponentChoices(plop);

  plop.setGenerator("vesper-component-documentation", {
    description:
      "Creates a documentation page for an existing vesper component",
    prompts: [
      {
        type: "autocomplete",
        name: "component",
        message: "Which component would you like to document?",
        source: (_answers: PlopTypes.Answers, input?: string) =>
          searchComponentChoices(componentChoices, input),
        /**
         * the prompt validates the selected choice object, while `--args`
         * bypasses the prompt entirely and validates a raw string
         */
        validate: (choice: string | { value?: string }) => {
          const component = typeof choice === "string" ? choice : choice.value;

          return (
            (!!component && componentChoices.includes(component)) ||
            `"${component}" is not a component in ${COMPONENTS_PATH}`
          );
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "{{ turbo.paths.root }}/docs/components/{{ component }}.mdx",
        templateFile: "templates/react-component.mdx.hbs",
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/apps/website/src/mdx-components.tsx",
        transform: (contents: string, data: PlopTypes.Answers) =>
          addToMdxComponents(
            contents,
            plop.renderString("{{ pascalCase component }}", data),
            plop.renderString("{{ component }}", data),
          ),
      },
    ],
  });
}
