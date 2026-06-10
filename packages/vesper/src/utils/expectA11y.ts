import axe from "axe-core";
import { expect } from "vitest";

export async function expectA11y(container: HTMLElement) {
  const results = await axe.run(container, { runOnly: ["wcag2aaa"] });
  const violations = results.violations.map(
    (v) => `[${v.id}] ${v.description} (${v.nodes.length} instance(s))`,
  );
  return expect(violations).toEqual([]);
}
