import type { ReactNode } from "react";

import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  ThemePersistenceScript,
  ThemeSwitcher,
  VESPER_THEMES,
  type VesperTheme,
} from "@/components/theme-switcher/theme-switcher";
import "@/styles/test.css";

/** The `localStorage` key that `ThemePersistenceScript` saves the theme under by default */
const STORAGE_KEY = "vesper-theme";

/** Accessibility labels for each of the theme switcher's buttons */
const BUTTON_LABELS: Record<VesperTheme, string> = {
  system: "Switch color theme to system preference",
  light: "Switch color theme to light mode",
  dark: "Switch color theme to dark mode",
};

/** Asserts that a theme switcher is displaying `theme` as its active theme */
async function expectActiveTheme(switcher: Element | null, theme: VesperTheme) {
  await waitFor(() =>
    expect(switcher).toHaveClass(`vesper-theme-switcher-${theme}`),
  );
}

/** Pages loaded by `loadPage`, which are removed after each test */
const pages = new Set<HTMLIFrameElement>();

/**
 * Loads a page with server rendered `head` and `body` content into a same-origin iframe, and resolves once it has loaded.
 *
 * Unlike scripts rendered by React in the browser, scripts in the page run while it loads, like they would in a server rendered page. The page shares `localStorage` with the test page, so changes made by the test page fire `storage` events in the page, like changes made in another browser tab would.
 */
async function loadPage(head?: ReactNode, body?: ReactNode) {
  const iframe = document.createElement("iframe");
  iframe.srcdoc = [
    "<!doctype html><html><head>",
    // errors thrown by scripts in the page aren't reported to the test runner, so collect them to check after the test
    '<script>window.errors = []; window.addEventListener("error", (event) => window.errors.push(event.error ?? event.message));</script>',
    renderToStaticMarkup(head),
    "</head><body>",
    renderToStaticMarkup(body),
    "</body></html>",
  ].join("");
  pages.add(iframe);

  const loaded = new Promise((resolve) =>
    iframe.addEventListener("load", resolve, { once: true }),
  );
  document.body.append(iframe);
  await loaded;

  if (!iframe.contentWindow) throw new Error("The page didn't load");
  return iframe.contentWindow;
}

/** Reads the theme set on a page's document */
function getPageTheme(page: Window) {
  return page.document.documentElement.getAttribute("data-vesper-theme");
}

/**
 * Sets the theme on a page's document (or removes it, when `theme` is `null`).
 *
 * Resolves after the change is handled by the mutation observers that were already observing the document (eg. the one that saves the theme), since mutation observers are notified in the order they were created
 */
function setPageTheme(page: Window, theme: string | null) {
  const root = page.document.documentElement;

  return new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      observer.disconnect();
      resolve();
    });
    observer.observe(root, { attributeFilter: ["data-vesper-theme"] });

    if (theme === null) root.removeAttribute("data-vesper-theme");
    else root.setAttribute("data-vesper-theme", theme);
  });
}

/**
 * Resolves after the next `count` `storage` events in a page are handled by the listeners that were already added (eg. the one that applies themes saved in other tabs), since event listeners are called in the order they were added
 */
function nextStorageEvent(page: Window, count = 1) {
  return new Promise<void>((resolve) => {
    let remaining = count;
    const listener = () => {
      if (--remaining > 0) return;
      page.removeEventListener("storage", listener);
      resolve();
    };
    page.addEventListener("storage", listener);
  });
}

/** Spies on the `localStorage` changes a page makes (changes made by the test page aren't included) */
function spyOnPageStorage(page: Window) {
  const { prototype } = (page as Window & typeof globalThis).Storage;
  return {
    setItem: vi.spyOn(prototype, "setItem"),
    removeItem: vi.spyOn(prototype, "removeItem"),
  };
}

/** Records each theme set on a page's document from now on (`null` when the theme is removed) */
function recordPageThemes(page: Window) {
  const themes: (string | null)[] = [];
  const observer = new MutationObserver((records) =>
    records.forEach(() => themes.push(getPageTheme(page))),
  );
  observer.observe(page.document.documentElement, {
    attributeFilter: ["data-vesper-theme"],
  });
  return themes;
}

afterEach(() => {
  const pageErrors = [...pages].flatMap(
    (iframe) => Reflect.get(iframe.contentWindow ?? {}, "errors") ?? [],
  );
  pages.forEach((iframe) => iframe.remove());
  pages.clear();

  cleanup();
  document.documentElement.removeAttribute("data-vesper-theme");
  localStorage.clear();
  sessionStorage.clear();

  expect(pageErrors).toEqual([]);
});

describe("ThemePersistenceScript [server]", () => {
  test("additional prop passthrough", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(
      <ThemePersistenceScript nonce="abc123" id="theme-script" />,
    );

    const script = container.querySelector("script");
    expect(script).toHaveAttribute("nonce", "abc123");
    expect(script).toHaveAttribute("id", "theme-script");
  });
});

describe("ThemePersistenceScript [unit]", () => {
  test.each(VESPER_THEMES)(
    "applies the saved %s theme before the page content loads",
    async (theme) => {
      localStorage.setItem(STORAGE_KEY, theme);

      const page = await loadPage(
        <ThemePersistenceScript />,
        // runs as soon as the page content starts loading
        <script
          dangerouslySetInnerHTML={{
            __html: `document.body.dataset.loadingTheme = document.documentElement.getAttribute("data-vesper-theme");`,
          }}
        />,
      );

      expect(page.document.body).toHaveAttribute("data-loading-theme", theme);
      expect(getPageTheme(page)).toBe(theme);
    },
  );

  test("doesn't set the theme when no theme is saved", async () => {
    const page = await loadPage(<ThemePersistenceScript />);
    expect(getPageTheme(page)).toBeNull();
  });

  test("ignores unknown saved themes", async () => {
    localStorage.setItem(STORAGE_KEY, "sepia");

    const page = await loadPage(<ThemePersistenceScript />);
    expect(getPageTheme(page)).toBeNull();
  });

  test.each(VESPER_THEMES)("saves the %s theme", async (theme) => {
    const page = await loadPage(<ThemePersistenceScript />);

    await setPageTheme(page, theme);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(theme);
  });

  test("doesn't save unknown themes", async () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const page = await loadPage(<ThemePersistenceScript />);

    await setPageTheme(page, "sepia");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  test("removing the theme removes the saved theme", async () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const page = await loadPage(<ThemePersistenceScript />);
    expect(getPageTheme(page)).toBe("dark");

    await setPageTheme(page, null);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  test.each(["my-app-theme", `it's a "theme" \\ key`])(
    "custom storage key: %s",
    async (storageKey) => {
      localStorage.setItem(storageKey, "dark");

      const page = await loadPage(
        <ThemePersistenceScript storageKey={storageKey} />,
      );
      expect(getPageTheme(page)).toBe("dark");

      await setPageTheme(page, "light");
      expect(localStorage.getItem(storageKey)).toBe("light");
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    },
  );

  test("only the first script on the page sets up persistence", async () => {
    localStorage.setItem("second-key", "dark");

    const page = await loadPage(
      <>
        <ThemePersistenceScript storageKey="first-key" />
        <ThemePersistenceScript storageKey="second-key" />
      </>,
    );
    expect(getPageTheme(page)).toBeNull();

    await setPageTheme(page, "light");
    expect(localStorage.getItem("first-key")).toBe("light");
    expect(localStorage.getItem("second-key")).toBe("dark");
  });

  test("keeps working when storage is unavailable", async () => {
    localStorage.setItem(STORAGE_KEY, "dark");

    const page = await loadPage(
      <>
        {/* make the page's storage throw when it's used, like it does when the browser blocks storage */}
        <script
          dangerouslySetInnerHTML={{
            __html: `Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Access is denied", "SecurityError"); } });`,
          }}
        />
        <ThemePersistenceScript />
      </>,
    );
    expect(getPageTheme(page)).toBeNull();

    await setPageTheme(page, "light");
    expect(getPageTheme(page)).toBe("light");

    const storageEvent = nextStorageEvent(page);
    localStorage.setItem(STORAGE_KEY, "system");
    await storageEvent;
    expect(getPageTheme(page)).toBe("light");

    // the `afterEach` hook checks that the page didn't throw any errors
  });

  /**
   * The test page shares `localStorage` with the pages it loads, so changing it from the test page fires `storage` events in those pages, like changes made in another browser tab would
   */
  describe("changes made in other tabs", () => {
    test.each(VESPER_THEMES)("applies the %s theme", async (theme) => {
      const page = await loadPage(<ThemePersistenceScript />);

      const storageEvent = nextStorageEvent(page);
      localStorage.setItem(STORAGE_KEY, theme);
      await storageEvent;

      expect(getPageTheme(page)).toBe(theme);
    });

    test("removing the saved theme resets the theme", async () => {
      localStorage.setItem(STORAGE_KEY, "dark");
      const page = await loadPage(<ThemePersistenceScript />);

      const storageEvent = nextStorageEvent(page);
      localStorage.removeItem(STORAGE_KEY);
      await storageEvent;

      expect(getPageTheme(page)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    test("clearing storage resets the theme", async () => {
      localStorage.setItem(STORAGE_KEY, "dark");
      const page = await loadPage(<ThemePersistenceScript />);

      const storageEvent = nextStorageEvent(page);
      localStorage.clear();
      await storageEvent;

      expect(getPageTheme(page)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    test("ignores other storage keys", async () => {
      localStorage.setItem(STORAGE_KEY, "dark");
      const page = await loadPage(<ThemePersistenceScript />);

      const storageEvent = nextStorageEvent(page);
      localStorage.setItem("another-key", "light");
      await storageEvent;

      expect(getPageTheme(page)).toBe("dark");
    });

    test("ignores unknown themes", async () => {
      localStorage.setItem(STORAGE_KEY, "dark");
      const page = await loadPage(<ThemePersistenceScript />);

      const storageEvent = nextStorageEvent(page);
      localStorage.setItem(STORAGE_KEY, "sepia");
      await storageEvent;

      expect(getPageTheme(page)).toBe("dark");
    });

    test("ignores sessionStorage changes", async () => {
      localStorage.setItem(STORAGE_KEY, "dark");
      const page = await loadPage(<ThemePersistenceScript />);

      const storageEvent = nextStorageEvent(page);
      sessionStorage.setItem(STORAGE_KEY, "light");
      await storageEvent;

      expect(getPageTheme(page)).toBe("dark");
    });

    /**
     * Changes made in quick succession are all saved before the page handles the first `storage` event. By then, the first events are out of date
     */
    describe("queued changes", () => {
      test("applies the newest theme without saving it again", async () => {
        const page = await loadPage(<ThemePersistenceScript />);
        const pageStorage = spyOnPageStorage(page);
        const pageThemes = recordPageThemes(page);

        const storageEvents = nextStorageEvent(page, 2);
        localStorage.setItem(STORAGE_KEY, "light");
        localStorage.setItem(STORAGE_KEY, "dark");
        await storageEvents;

        expect(pageThemes).toEqual(["dark"]);
        expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
        expect(pageStorage.setItem).not.toHaveBeenCalled();
      });

      test("a queued removal doesn't remove a newer theme", async () => {
        localStorage.setItem(STORAGE_KEY, "dark");
        const page = await loadPage(<ThemePersistenceScript />);
        const pageStorage = spyOnPageStorage(page);
        const pageThemes = recordPageThemes(page);

        const storageEvents = nextStorageEvent(page, 2);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_KEY, "light");
        await storageEvents;

        expect(pageThemes).toEqual(["light"]);
        expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
        expect(pageStorage.setItem).not.toHaveBeenCalled();
        expect(pageStorage.removeItem).not.toHaveBeenCalled();
      });

      test("tabs don't save each other's themes again", async () => {
        const page = await loadPage(<ThemePersistenceScript />);
        const otherPage = await loadPage(<ThemePersistenceScript />);
        const pageStorage = spyOnPageStorage(page);
        const otherPageStorage = spyOnPageStorage(otherPage);

        // both changes are saved before the other page handles the first one
        const storageEvents = nextStorageEvent(otherPage, 2);
        await setPageTheme(page, "light");
        await setPageTheme(page, "dark");
        await storageEvents;

        // saving the other page's themes again would fire `storage` events back in this page, which could keep echoing between them
        expect(pageStorage.setItem.mock.calls).toEqual([
          [STORAGE_KEY, "light"],
          [STORAGE_KEY, "dark"],
        ]);
        expect(otherPageStorage.setItem).not.toHaveBeenCalled();
        expect(getPageTheme(otherPage)).toBe("dark");
        expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
      });
    });
  });

  /**
   * Scripts rendered by React in the browser never run, so `useTheme` (and `ThemeSwitcher`) set up persistence instead when the document has a `ThemePersistenceScript`
   */
  describe("rendered in the browser", () => {
    let storageKey: string;
    let testCount = 0;
    let consoleError: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      // persistence is only set up once per page, so let each test set it up again. Setups from earlier tests stay active, but they only save the theme under their own storage key
      Reflect.deleteProperty(
        window,
        Symbol.for("vesper-theme-persistence-script"),
      );
      storageKey = `vesper-theme-test-${++testCount}`;

      // hide React's (expected) error about rendering a script that won't run
      const logError = console.error.bind(console);
      consoleError = vi
        .spyOn(console, "error")
        .mockImplementation((message, ...args) => {
          if (String(message).startsWith("Encountered a script tag")) return;
          logError(message, ...args);
        });
    });

    afterEach(() => {
      consoleError.mockRestore();
    });

    /** Renders a theme switcher, with a `ThemePersistenceScript` that saves the theme under `storageKey` */
    function renderWithScript() {
      const result = render(
        <>
          <ThemePersistenceScript storageKey={storageKey} />
          <ThemeSwitcher data-testid="switcher" />
        </>,
      );
      return { ...result, switcher: result.getByTestId("switcher") };
    }

    test("ThemeSwitcher applies the saved theme", async () => {
      localStorage.setItem(storageKey, "dark");

      const { switcher } = renderWithScript();
      await expectActiveTheme(switcher, "dark");
      expect(document.documentElement).toHaveAttribute(
        "data-vesper-theme",
        "dark",
      );
    });

    test("ThemeSwitcher saves the theme", async () => {
      const { switcher } = renderWithScript();

      fireEvent.click(
        within(switcher).getByRole("button", { name: BUTTON_LABELS.light }),
      );
      await waitFor(() =>
        expect(localStorage.getItem(storageKey)).toBe("light"),
      );
    });

    test("ThemeSwitcher applies themes saved in other tabs", async () => {
      const { switcher } = renderWithScript();
      const otherTab = await loadPage();

      otherTab.localStorage.setItem(storageKey, "dark");
      await expectActiveTheme(switcher, "dark");

      otherTab.localStorage.removeItem(storageKey);
      await expectActiveTheme(switcher, "system");
    });

    test("ThemeSwitcher doesn't save the theme without a ThemePersistenceScript", async () => {
      const result = render(<ThemeSwitcher />);

      fireEvent.click(result.getByRole("button", { name: BUTTON_LABELS.dark }));
      await expectActiveTheme(result.container.firstElementChild, "dark");

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });
});
