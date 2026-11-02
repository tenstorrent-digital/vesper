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

export function getContrastRatio(element: Element) {
  const style = getComputedStyle(element);
  const backgroundLayers = [
    style.backgroundColor,
    ...(style.backgroundImage.match(/rgba?\([^)]*\)/g) ?? []).slice(0, 1),
  ];

  const background = compositeColors(backgroundLayers);
  const foreground = compositeColors([...backgroundLayers, style.color]);

  const backgroundLuminance = relativeLuminance(background);
  const foregroundLuminance = relativeLuminance(foreground);

  return (
    (Math.max(backgroundLuminance, foregroundLuminance) + 0.05) /
    (Math.min(backgroundLuminance, foregroundLuminance) + 0.05)
  );
}

function compositeColors(colors: string[]) {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("failed to get a 2d canvas context");
  }

  for (const color of colors) {
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
  }

  const [red = 0, green = 0, blue = 0] = context.getImageData(0, 0, 1, 1).data;
  return { red, green, blue };
}

function relativeLuminance({
  red,
  green,
  blue,
}: ReturnType<typeof compositeColors>) {
  return (
    0.2126 * linearizeChannel(red) +
    0.7152 * linearizeChannel(green) +
    0.0722 * linearizeChannel(blue)
  );
}

function linearizeChannel(channel: number) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
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
