/**
 * charset used to generate random IDs from `nanoid`'s alphabet
 *
 * - 64 characters
 * - URL safe
 *
 * @see: https://github.com/ai/nanoid/blob/c6246e036ca5e7a1d362c1a80726bab63b767754/url-alphabet/index.js#L12
 */
const charset =
  "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

/**
 * id generation function adapted from https://github.com/ai/nanoid/blob/c6246e036ca5e7a1d362c1a80726bab63b767754/non-secure/index.js#L5-L17
 */
export function generateId() {
  let id = "";
  let i = 16;
  const len = charset.length;
  while (i--) id += charset[(Math.random() * len) | 0];
  return id;
}
