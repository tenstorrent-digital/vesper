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
        path: "{{ turbo.paths.root }}/packages/react/src/{{ name }}.tsx",
        templateFile: "templates/react-component.hbs",
      },
    ],
  });
}
