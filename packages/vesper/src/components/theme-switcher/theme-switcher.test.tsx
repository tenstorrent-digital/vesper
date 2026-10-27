import type { ReactNode } from "react";

import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  within,
} from "@testing-library/react";
import axe from "axe-core";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  THEME_SWITCHER_SIZES,
  ThemePersistenceScript,
  ThemeSwitcher,
  useTheme,
  VESPER_THEMES,
  type VesperTheme,
} from "@/components/theme-switcher/theme-switcher";
import "@/styles/test.css";

/** The `localStorage` key that tests save the theme to */
const STORAGE_KEY = "vesper-theme-test";

/** Accessibility labels for each of the theme switcher's buttons */
const BUTTON_LABELS: Record<VesperTheme, string> = {
  system: "Switch color theme to system preference",
  light: "Switch color theme to light mode",
  dark: "Switch color theme to dark mode",
};

/** Server rendered elements attached to the document, which are removed after each test */
const serverElements = new Set<Element>();

/** Renders the theme returned by `useTheme` as text, so it can be read from server rendered HTML */
function ThemeProbe() {
  const [theme] = useTheme();
  return <>{theme}</>;
}

/** Server renders `ui` into a container attached to the document, so it gets styled */
function renderServerHtml(ui: ReactNode) {
  const container = document.body.appendChild(document.createElement("div"));
  container.innerHTML = renderToString(ui);
  serverElements.add(container);
  return container;
}

/**
 * Changes the theme, then waits for mutation observers to be notified about the change, and for react to re-render.
 *
 * Mutation observers are notified in a microtask, after the change has been made
 */
async function changeTheme(change: () => void) {
  await act(async () => change());
}

/**
 * Renders the `useTheme` hook without having to use it inside a component.
 *
 * Returns the `result` ref rather than `result.current`, so values can be read after the hook re-renders
 */
function renderUseTheme() {
  return renderHook(() => useTheme()).result;
}

/** Asserts that a theme switcher's react state is `theme` */
function expectActiveTheme(switcher: Element | null, theme: VesperTheme) {
  expect(switcher).toHaveAttribute("data-vesper-theme", theme);
  expect(switcher).toHaveClass(`vesper-theme-switcher-${theme}`);
}

/** Resolves a css color to the value `getComputedStyle` returns for it, using the document's theme */
function resolveColor(color: string) {
  const probe = document.body.appendChild(document.createElement("span"));
  probe.style.color = color;
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
}

/**
 * Asserts that a theme switcher's indicator and highlighted button show `theme`.
 *
 * Both are styled from the document's theme with css, rather than from the switcher's react state, so the switcher must be attached to the document
 */
function expectDisplayedTheme(switcher: Element | null, theme: VesperTheme) {
  const highlightedColor = resolveColor("var(--vesper-icon-primary)");
  const buttons = Array.from(
    switcher?.querySelectorAll<HTMLElement>(".vesper-theme-switcher-button") ??
      [],
  );
  const highlighted = buttons.filter(
    (button) => getComputedStyle(button).color === highlightedColor,
  );
  expect(highlighted).toHaveLength(1);
  expect(highlighted[0]).toHaveAccessibleName(BUTTON_LABELS[theme]);

  const indicator = switcher?.querySelector<HTMLElement>(
    ".vesper-theme-switcher-indicator",
  );
  expect(indicator?.offsetLeft).toBe(highlighted[0]?.offsetLeft);
}

afterEach(() => {
  cleanup();
  serverElements.forEach((element) => element.remove());
  serverElements.clear();
  document.documentElement.removeAttribute("data-vesper-theme");
  localStorage.clear();
  vi.restoreAllMocks();

  // the script's setup can't be undone, so tests only run it in their own pages (see `theme-switcher.storage.test.tsx`)
  expect(
    Reflect.has(window, Symbol.for("vesper-theme-persistence-script")),
  ).toBe(false);
});

describe("theme-switcher [unit]", () => {
  THEME_SWITCHER_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const result = render(<ThemeSwitcher size={size} />);
      expect(result.container.firstChild).toHaveClass(
        `vesper-theme-switcher-${size}`,
      );
    });
  });

  test("additional prop passthrough", () => {
    const result = render(<ThemeSwitcher aria-label="custom label" />);

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("custom className", () => {
    const result = render(<ThemeSwitcher size="lg" className="custom-class" />);

    const switcher = result.container.firstChild;
    expect(switcher).toHaveClass("vesper-theme-switcher");
    expect(switcher).toHaveClass("vesper-theme-switcher-lg");
    expect(switcher).toHaveClass("custom-class");
  });

  test("defaults to the system theme", () => {
    const result = render(<ThemeSwitcher />);

    expectActiveTheme(result.container.firstElementChild, "system");
    expectDisplayedTheme(result.container.firstElementChild, "system");
  });

  VESPER_THEMES.forEach((theme) => {
    test(`reads the ${theme} theme from the document`, () => {
      document.documentElement.setAttribute("data-vesper-theme", theme);

      const result = render(<ThemeSwitcher />);
      expectActiveTheme(result.container.firstElementChild, theme);
      expectDisplayedTheme(result.container.firstElementChild, theme);
    });
  });

  test("falls back to the system theme for unknown themes", () => {
    document.documentElement.setAttribute("data-vesper-theme", "sepia");

    const result = render(<ThemeSwitcher />);
    expectActiveTheme(result.container.firstElementChild, "system");
    expectDisplayedTheme(result.container.firstElementChild, "system");
  });

  test("theme switching", async () => {
    const result = render(<ThemeSwitcher />);

    async function switchTo(theme: VesperTheme) {
      await changeTheme(() =>
        fireEvent.click(
          result.getByRole("button", { name: BUTTON_LABELS[theme] }),
        ),
      );

      expect(document.documentElement).toHaveAttribute(
        "data-vesper-theme",
        theme,
      );
      expectActiveTheme(result.container.firstElementChild, theme);
      expectDisplayedTheme(result.container.firstElementChild, theme);
    }

    await switchTo("light");
    await switchTo("dark");
    await switchTo("system");
  });

  test("multiple theme switchers stay in sync", async () => {
    const result = render(
      <>
        <ThemeSwitcher data-testid="first" />
        <ThemeSwitcher data-testid="second" />
      </>,
    );
    const first = result.getByTestId("first");
    const second = result.getByTestId("second");

    await changeTheme(() =>
      fireEvent.click(
        within(first).getByRole("button", { name: BUTTON_LABELS.dark }),
      ),
    );
    expectActiveTheme(first, "dark");
    expectActiveTheme(second, "dark");

    await changeTheme(() =>
      fireEvent.click(
        within(second).getByRole("button", { name: BUTTON_LABELS.light }),
      ),
    );
    expectActiveTheme(first, "light");
    expectActiveTheme(second, "light");
  });

  test("theme switchers in separate react roots stay in sync", async () => {
    const first = render(<ThemeSwitcher data-testid="first" />).getByTestId(
      "first",
    );
    const second = render(<ThemeSwitcher />).container.firstElementChild;

    await changeTheme(() =>
      fireEvent.click(
        within(first).getByRole("button", { name: BUTTON_LABELS.dark }),
      ),
    );
    expectActiveTheme(first, "dark");
    expectActiveTheme(second, "dark");
  });

  test("updates when the theme is set directly on the document", async () => {
    const result = render(<ThemeSwitcher />);

    await changeTheme(() =>
      document.documentElement.setAttribute("data-vesper-theme", "dark"),
    );
    expectActiveTheme(result.container.firstElementChild, "dark");
    expectDisplayedTheme(result.container.firstElementChild, "dark");
  });
});

describe("useTheme [unit]", () => {
  test("defaults to the system theme", () => {
    const result = renderUseTheme();
    expect(result.current[0]).toBe("system");
  });

  test("reads the theme from the document", () => {
    document.documentElement.setAttribute("data-vesper-theme", "dark");
    const result = renderUseTheme();
    expect(result.current[0]).toBe("dark");
  });

  test("setting the theme", async () => {
    const result = renderUseTheme();
    const [, setTheme] = result.current;

    await changeTheme(() => setTheme("light"));
    expect(document.documentElement).toHaveAttribute(
      "data-vesper-theme",
      "light",
    );
    expect(result.current[0]).toBe("light");
  });

  test("updates when the theme is set directly on the document", async () => {
    const result = renderUseTheme();

    await changeTheme(() =>
      document.documentElement.setAttribute("data-vesper-theme", "dark"),
    );
    expect(result.current[0]).toBe("dark");

    await changeTheme(() =>
      document.documentElement.removeAttribute("data-vesper-theme"),
    );
    expect(result.current[0]).toBe("system");
  });
});

describe("theme-switcher [server]", () => {
  beforeEach(() => {
    // the server render should never read the theme from the document
    document.documentElement.setAttribute("data-vesper-theme", "dark");
  });

  test("useTheme renders the system theme", () => {
    expect(renderToString(<ThemeProbe />)).toBe("system");
  });

  test("ThemeSwitcher renders the system theme", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<ThemeSwitcher />);

    expectActiveTheme(container.firstElementChild, "system");
  });

  test("ThemeSwitcher displays the document's theme before hydrating", () => {
    const container = renderServerHtml(<ThemeSwitcher />);

    // the server rendered html has the system theme, but the indicator and highlighted button are styled from the document
    expectActiveTheme(container.firstElementChild, "system");
    expectDisplayedTheme(container.firstElementChild, "dark");
  });

  test("useTheme hydrates with the system theme, then reads the document", () => {
    const onRecoverableError = vi.fn();
    const container = renderServerHtml(<ThemeProbe />);
    expect(container).toHaveTextContent("system");

    const result = render(<ThemeProbe />, {
      container,
      hydrate: true,
      onRecoverableError,
    });

    // a hydration mismatch is reported as a recoverable error
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(result.container).toHaveTextContent("dark");
  });

  test("ThemeSwitcher hydrates with the system theme, then reads the document", () => {
    const onRecoverableError = vi.fn();
    const container = renderServerHtml(<ThemeSwitcher />);
    expectActiveTheme(container.firstElementChild, "system");

    const result = render(<ThemeSwitcher />, {
      container,
      hydrate: true,
      onRecoverableError,
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
    expectActiveTheme(result.container.firstElementChild, "dark");
    expectDisplayedTheme(result.container.firstElementChild, "dark");
  });

  test("ThemePersistenceScript hydrates without mismatches", () => {
    const consoleError = vi.spyOn(console, "error");
    const onRecoverableError = vi.fn();
    const ui = <ThemePersistenceScript storageKey={STORAGE_KEY} />;
    const container = renderServerHtml(ui);

    render(ui, { container, hydrate: true, onRecoverableError });

    // react logs attribute mismatches (including the script's content) as console errors
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
  });

  test("ThemePersistenceScript hydrates when the browser hides its nonce", () => {
    const consoleError = vi.spyOn(console, "error");
    const onRecoverableError = vi.fn();
    const ui = (
      <ThemePersistenceScript storageKey={STORAGE_KEY} nonce="test-nonce" />
    );
    const container = renderServerHtml(ui);

    /**
     * with a content security policy, browsers empty the `nonce` attribute once the script is parsed, and only keep
     * its value in the `nonce` property. Setting the attribute changes the property too, so it's set back afterwards
     */
    const script = container.querySelector("script");
    script?.setAttribute("nonce", "");
    if (script) script.nonce = "test-nonce";
    expect(script).toHaveAttribute("nonce", "");
    expect(script?.nonce).toBe("test-nonce");

    render(ui, { container, hydrate: true, onRecoverableError });

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
  });
});

describe("theme-switcher [snapshot]", () => {
  test("lg", async () => {
    const { container } = render(<ThemeSwitcher size="lg" />);

    expect(container.firstChild).toMatchSnapshot();
  });

  test("sm", async () => {
    const { container } = render(<ThemeSwitcher size="sm" />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("theme-switcher [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.body.style.removeProperty("background");
    });

    test(`a11y (lg, ${theme})`, async () => {
      const { container } = render(<ThemeSwitcher size="lg" />);

      expect(await axe.run(container)).toHaveNoViolations();
    });

    test(`a11y (sm, ${theme})`, async () => {
      const { container } = render(<ThemeSwitcher size="sm" />);

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
