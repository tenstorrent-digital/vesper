/**
 * given a kebab case filename (from node:fs), returns the component name
 */
export const convertKebabToPascalCase = (name: string) => {
  const words = name.split("-");
  const pascalCase = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return pascalCase.join(" "); // re-add space
};

/**
 * given a componentName in PascalCase, returns the kebab case filename
 */
export const convertPascalToKebabCase = (name: string) => {
  const words = name.split(" ");
  const kebabCase = words.map((word) => {
    return word.charAt(0).toLowerCase() + word.slice(1);
  });
  return kebabCase.join("-"); // re-add hyphen
};
