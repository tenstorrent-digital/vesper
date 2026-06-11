import { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
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
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/vesper/src/components/{{ kebabCase name }}/{{ kebabCase name }}.test.tsx",
        templateFile: "templates/react-component-test.hbs",
      },
      {
        type: "append",
        path: "{{ turbo.paths.root }}/packages/vesper/src/styles/styles.css",
        pattern: /\/\* components \*\//,
        template:
          '@import "../components/{{ kebabCase name }}/{{ kebabCase name }}.css";',
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
}
