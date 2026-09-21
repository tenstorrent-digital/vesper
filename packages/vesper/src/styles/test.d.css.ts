/**
 * type declaration for the side-effect import of `@/styles/test.css` in tests
 *
 * typescript 7 reports "Cannot find module or type declarations for side-effect import"
 * for side-effect imports that can't resolve to a declaration, so in `tsconfig.test.json`
 * we set `allowArbitraryExtensions`, and then provide (empty) types for `test.css` in this
 * file (not ideal but alas)
 *
 * see: `tsconfig.test.json`
 */
export {};
