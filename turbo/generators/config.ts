import { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("react-component", {
    description: "Creates a new component in the react package",
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
        message: "What is the root element for this component?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/vesper/src/components/{{ name }}/{{ name }}.tsx",
        templateFile: "templates/react-component.hbs",
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/packages/vesper/src/components/{{ name }}/{{ name }}.css",
      },
      {
        type: "append",
        path: "{{ turbo.paths.root }}/packages/vesper/src/styles/index.css",
        pattern: /[\s\S]*(?=\n)/,
        template: '@import "../components/{{ name }}/{{ name }}.css";',
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/packages/vesper/package.json",
        pattern: /"exports"\s*:\s*\{/,
        template: [
          `"exports": {`,
          `    "./{{ name }}": {`,
          `      "types": "./dist/components/{{ name }}/{{ name }}.d.ts",`,
          `      "import": "./dist/components/{{ name }}/{{ name }}.js"`,
          `    },`,
        ].join("\n"),
      },
    ],
  });
}
