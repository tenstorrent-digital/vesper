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
 *
 * handles word boundaries within a single token ("AvatarGroup" -> "avatar-group"),
 * acronyms ("HTTPServer" -> "http-server"), and whitespace/underscore separated
 * names ("Avatar Group" -> "avatar-group") so it round-trips with
 * convertKebabToPascalCase
 */
export const convertPascalToKebabCase = (name: string) => {
  return name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // avatarGroup -> avatar-Group
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2") // HTTPServer -> HTTP-Server
    .replace(/[\s_]+/g, "-") // "Avatar Group" -> "Avatar-Group"
    .replace(/-+/g, "-") // collapse repeated hyphens
    .toLowerCase();
};
