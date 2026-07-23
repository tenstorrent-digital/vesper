/**
 * given a kebab case filename (from node:fs), returns the component name
 */
export const getComponentName = (name: string) => {
  const words = name.split("-");
  const pascalCase = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return pascalCase.join(" "); // re-add space
};
