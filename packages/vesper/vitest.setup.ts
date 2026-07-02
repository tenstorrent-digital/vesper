import * as jestMatchers from "@testing-library/jest-dom/matchers";
import * as axeMatchers from "vitest-axe/matchers";
import { expect } from "vitest";
import axe from "axe-core";

expect.extend(jestMatchers);
expect.extend(axeMatchers);

/**
 * axe-core tags we want to test for
 *
 * @see https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#axe-core-tags for available tags
 * @see https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md for individual rules
 */
const ENABLED_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
  "wcag2aaa",
];

/**
 * globally configure axe-core to only run rules matching our desired tags
 */
const accessibilityRules = axe.getRules(ENABLED_TAGS);

axe.configure({
  rules: accessibilityRules.map((rule) => ({
    id: rule.ruleId,
    enabled:
      /**
       * disable rules with the `cat.semantics` tag (mostly document-level structure checks) that don't apply to individual component tests
       */
      !rule.tags.includes("cat.semantics"),
  })),
});
