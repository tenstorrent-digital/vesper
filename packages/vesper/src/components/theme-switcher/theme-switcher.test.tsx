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
  ThemeSwitcher,
  useTheme,
  VESPER_THEMES,
  type VesperTheme,
} from "@/components/theme-switcher/theme-switcher";
import "@/styles/test.css";

/** Accessibility labels for each of the theme switcher's buttons */
const BUTTON_LABELS: Record<VesperTheme, string> = {
  system: "Switch color theme to system preference",
  light: "Switch color theme to light mode",
  dark: "Switch color theme to dark mode",
};

/** Renders the theme returned by `useTheme` as text, so it can be read from server rendered HTML */
function ThemeProbe(props: { serverTheme?: VesperTheme }) {
  const [theme] = useTheme(props.serverTheme);
  return <>{theme}</>;
}

/** Asserts that a theme switcher is displaying `theme` as its active theme */
function expectActiveTheme(switcher: Element | null, theme: VesperTheme) {
  expect(switcher).toHaveAttribute("data-vesper-theme", theme);
  expect(switcher).toHaveClass(`vesper-theme-switcher-${theme}`);

  const activeButtons = switcher?.querySelectorAll(
    ".vesper-theme-switcher-button-active",
  );
  expect(activeButtons).toHaveLength(1);
  expect(activeButtons?.[0]).toHaveAccessibleName(BUTTON_LABELS[theme]);
}

/**
 * Renders the `useTheme` hook without having to use it inside a component.
 *
 * Returns the `result` ref rather than `result.current`, so values can be read after the hook re-renders
 */
function renderUseTheme(serverTheme?: VesperTheme) {
  return renderHook(() => useTheme(serverTheme)).result;
}

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("data-vesper-theme");
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
  });

  VESPER_THEMES.forEach((theme) => {
    test(`reads the ${theme} theme from the document`, () => {
      document.documentElement.setAttribute("data-vesper-theme", theme);

      const result = render(<ThemeSwitcher />);
      expectActiveTheme(result.container.firstElementChild, theme);
    });
  });

  test("falls back to the system theme for unknown themes", () => {
    document.documentElement.setAttribute("data-vesper-theme", "sepia");

    const result = render(<ThemeSwitcher />);
    expectActiveTheme(result.container.firstElementChild, "system");
  });

  test("ignores the server theme when rendering in the browser", () => {
    document.documentElement.setAttribute("data-vesper-theme", "light");

    const result = render(<ThemeSwitcher serverTheme="dark" />);
    expectActiveTheme(result.container.firstElementChild, "light");
  });

  test("theme switching", () => {
    const result = render(<ThemeSwitcher />);

    (["light", "dark", "system"] as const).forEach((theme) => {
      fireEvent.click(
        result.getByRole("button", { name: BUTTON_LABELS[theme] }),
      );

      expect(document.documentElement).toHaveAttribute(
        "data-vesper-theme",
        theme,
      );
      expectActiveTheme(result.container.firstElementChild, theme);
    });
  });

  test("multiple theme switchers stay in sync", () => {
    const result = render(
      <>
        <ThemeSwitcher data-testid="first" />
        <ThemeSwitcher data-testid="second" />
      </>,
    );
    const first = result.getByTestId("first");
    const second = result.getByTestId("second");

    fireEvent.click(
      within(first).getByRole("button", { name: BUTTON_LABELS.dark }),
    );
    expectActiveTheme(first, "dark");
    expectActiveTheme(second, "dark");

    fireEvent.click(
      within(second).getByRole("button", { name: BUTTON_LABELS.light }),
    );
    expectActiveTheme(first, "light");
    expectActiveTheme(second, "light");
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

  test("ignores the server theme in the browser", () => {
    const result = renderUseTheme("dark");
    expect(result.current[0]).toBe("system");
  });

  test("setting the theme", () => {
    const result = renderUseTheme();
    const [, setTheme] = result.current;

    act(() => setTheme("light"));
    expect(document.documentElement).toHaveAttribute(
      "data-vesper-theme",
      "light",
    );
    expect(result.current[0]).toBe("light");
  });
});

describe("theme-switcher [server]", () => {
  beforeEach(() => {
    // the server render should never read the theme from the document
    document.documentElement.setAttribute("data-vesper-theme", "dark");
  });

  test("useTheme renders the system theme by default", () => {
    expect(renderToString(<ThemeProbe />)).toBe("system");
  });

  test("useTheme renders the server theme", () => {
    expect(renderToString(<ThemeProbe serverTheme="light" />)).toBe("light");
  });

  test("ThemeSwitcher renders the system theme by default", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<ThemeSwitcher />);

    expectActiveTheme(container.firstElementChild, "system");
  });

  test("ThemeSwitcher renders the server theme", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<ThemeSwitcher serverTheme="light" />);

    expectActiveTheme(container.firstElementChild, "light");
  });

  test("useTheme hydrates with the server theme, then reads the document", () => {
    const onRecoverableError = vi.fn();
    const container = document.body.appendChild(document.createElement("div"));
    container.innerHTML = renderToString(<ThemeProbe serverTheme="light" />);
    expect(container).toHaveTextContent("light");

    const result = render(<ThemeProbe serverTheme="light" />, {
      container,
      hydrate: true,
      onRecoverableError,
    });

    // a hydration mismatch is reported as a recoverable error
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(result.container).toHaveTextContent("dark");
  });

  test("ThemeSwitcher hydrates with the server theme, then reads the document", () => {
    const onRecoverableError = vi.fn();
    const container = document.body.appendChild(document.createElement("div"));
    container.innerHTML = renderToString(<ThemeSwitcher serverTheme="light" />);
    expectActiveTheme(container.firstElementChild, "light");

    const result = render(<ThemeSwitcher serverTheme="light" />, {
      container,
      hydrate: true,
      onRecoverableError,
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
    expectActiveTheme(result.container.firstElementChild, "dark");
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
