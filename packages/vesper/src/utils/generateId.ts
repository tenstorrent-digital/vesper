const charset =
  "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

/**
 * Generates a random 16-character string
 * */
export function generateId() {
  let id = "";
  let i = 16;
  const len = charset.length;
  while (i--) id += charset[(Math.random() * len) | 0];
  return id;
}
