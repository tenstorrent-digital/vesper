import * as jestMatchers from "@testing-library/jest-dom/matchers";
import * as axeMatchers from "vitest-axe/matchers";
import { expect } from "vitest";
import axe from "axe-core";

expect.extend(jestMatchers);
expect.extend(axeMatchers);

/**
 * exclude all rules categorized under cat.semantics (e.g. landmark-*,
 * page-has-heading-one, definition-list, list/listitem) as they test page-level
 * structure and document semantics rather than individual components
 *
 * @see https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
 */
const semanticsRules = axe.getRules(["cat.semantics"]);

axe.configure({
  rules: semanticsRules.map((rule) => ({
    id: rule.ruleId,
    enabled: false,
  })),
});
