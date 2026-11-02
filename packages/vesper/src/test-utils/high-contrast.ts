import axe from "axe-core";
import { afterAll, beforeAll } from "vitest";
import { commands } from "vitest/browser";

/**
 * value for the `prefers-contrast` media feature (`null` disables emulation)
 *
 * @see https://playwright.dev/docs/api/class-page#page-emulate-media-option-contrast
 */
export type EmulatedContrast = "more" | "no-preference" | null;

declare module "vitest/browser" {
  interface BrowserCommands {
    /**
     * emulate the `prefers-contrast` media feature (see `vitest.config.ts`)
     */
    emulateContrast: (contrast: EmulatedContrast) => Promise<void>;
  }
}

/**
 * Emulates `@media (prefers-contrast: more)` for every test in the current suite.
 *
 * Call this at the top of a `describe` block. Emulation is enabled before the
 * suite's first test and disabled again after its last test.
 *
 * @example
 * describe("button [a11y, high contrast]", () => {
 *   emulateHighContrast();
 *
 *   test("wcag2aaa", async () => {
 *     const { container } = render(<Button>Text</Button>);
 *     expect(await runAxeWcag2aaa(container)).toHaveNoViolations();
 *   });
 * });
 */
export function emulateHighContrast() {
  beforeAll(async () => {
    await commands.emulateContrast("more");

    // throw if the media feature is not applied so tests never silently run against default styles
    if (!prefersMoreContrast()) {
      throw new Error("failed to emulate `prefers-contrast: more`");
    }
  });

  afterAll(async () => {
    await commands.emulateContrast(null);
  });
}

/**
 * Runs axe-core with only the WCAG 2 AAA (`wcag2aaa`) rules enabled.
 *
 * @param {axe.ElementContext} context - The element (or document) to check
 *
 * @example
 * expect(await runAxeWcag2aaa(container)).toHaveNoViolations();
 */
export function runAxeWcag2aaa(context: axe.ElementContext) {
  return axe.run(context, {
    runOnly: { type: "tag", values: ["wcag2aaa"] },
  });
}

// `window.matchMedia` is mocked in `vitest.setup.ts`, so check the media feature with css instead
function prefersMoreContrast() {
  const probe = document.createElement("style");
  probe.textContent =
    "@media (prefers-contrast: more) { :root { --vesper-test-prefers-contrast: more; } }";
  document.head.append(probe);

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--vesper-test-prefers-contrast")
    .trim();
  probe.remove();

  return value === "more";
}
