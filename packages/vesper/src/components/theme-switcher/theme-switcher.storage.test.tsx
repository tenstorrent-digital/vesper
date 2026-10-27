import { act, cleanup, renderHook } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, test } from "vitest";

import {
  ThemePersistenceScript,
  useTheme,
  VESPER_THEMES,
} from "@/components/theme-switcher/theme-switcher";

/** The `localStorage` key that tests save the theme to */
const STORAGE_KEY = "vesper-theme-test";

/** The `localStorage` key that `openPage` changes, to wait for `storage` events from before the page opened */
const SETTLE_KEY = "vesper-theme-test-settle";

/** Pages opened with `openPage`, which are closed after each test */
const pages = new Set<HTMLIFrameElement>();

/** A page opened with `openPage` */
interface Page {
  window: Window;
  root: HTMLElement;
}

/**
 * Opens a new page in an iframe, which is closed after the test.
 *
 * The `ThemePersistenceScript` stays set up for as long as its page is open, so tests run it in their own page
 * instead of the test's page. The new page has the same origin as the test's page, so they share `localStorage`, and
 * the test changing `localStorage` fires `storage` events in the new page, like another browser tab does
 */
async function openPage(): Promise<Page> {
  const frame = document.body.appendChild(document.createElement("iframe"));
  pages.add(frame);

  const frameWindow = frame.contentWindow;
  const root = frame.contentDocument?.documentElement;
  if (!frameWindow || !root) throw new Error("the page didn't open");
  const page = { window: frameWindow, root };

  /**
   * a new page also gets `storage` events for changes made shortly before it opened (eg. by the previous test), and
   * those could change the page partway through the test. Events arrive in order, so once the page gets the event
   * for a change made now, the earlier ones have arrived too
   */
  await changeStorage(page, { key: SETTLE_KEY, newValue: "settled" });
  await changeStorage(page, { key: SETTLE_KEY, newValue: null });

  return page;
}

/** Runs a server rendered `ThemePersistenceScript` in `page`, like the browser does when it parses the page */
function runPersistenceScript(page: Page, storageKey: string) {
  const template = document.createElement("template");
  template.innerHTML = renderToString(
    <ThemePersistenceScript storageKey={storageKey} />,
  );
  const parsed = template.content.querySelector("script");
  if (!parsed) throw new Error("ThemePersistenceScript didn't render a script");

  // scripts parsed from html never run, so the script is copied into a new one, which runs as soon as it's attached
  const pageDocument = page.root.ownerDocument;
  const script = pageDocument.createElement("script");
  Array.from(parsed.attributes).forEach(({ name, value }) =>
    script.setAttribute(name, value),
  );
  script.textContent = parsed.textContent;
  pageDocument.head.appendChild(script);
}

/** Waits for mutation observers to be notified about changes, which happens in a microtask after the change */
function waitForMutationObservers() {
  return new Promise((resolve) => setTimeout(resolve));
}

/**
 * Changes storage from the test's page, like another browser tab does, then waits for `page` to get the `storage` event
 * for the change.
 *
 * A `null` value removes `key`, and a `null` key clears storage. Clearing storage needs something in it, since
 * clearing empty storage doesn't fire an event
 */
async function changeStorage(
  page: Page,
  change: {
    key: string | null;
    newValue: string | null;
    area?: "localStorage" | "sessionStorage";
  },
) {
  const { key, newValue, area = "localStorage" } = change;

  const received = new Promise<void>((resolve) => {
    const handleStorage = (event: StorageEvent) => {
      if (
        event.storageArea !== page.window[area] ||
        event.key !== key ||
        event.newValue !== newValue
      ) {
        return;
      }
      page.window.removeEventListener("storage", handleStorage);
      resolve();
    };
    page.window.addEventListener("storage", handleStorage);
  });

  const storage = window[area];
  if (key === null) storage.clear();
  else if (newValue === null) storage.removeItem(key);
  else storage.setItem(key, newValue);

  await received;
}

/**
 * Changes the theme, then waits for mutation observers to be notified about the change, and for react to re-render.
 *
 * Mutation observers are notified in a microtask, after the change has been made
 */
async function changeTheme(change: () => void) {
  await act(async () => change());
}

/** Simulates another browser tab changing a `localStorage` key, in the test's page */
async function dispatchStorageEvent(key: string, newValue: string | null) {
  await changeTheme(() =>
    window.dispatchEvent(new StorageEvent("storage", { key, newValue })),
  );
}

/**
 * Renders the `useTheme` hook without having to use it inside a component.
 *
 * Returns the `result` ref rather than `result.current`, so values can be read after the hook re-renders
 */
function renderUseTheme() {
  return renderHook(() => useTheme()).result;
}

afterEach(() => {
  cleanup();
  pages.forEach((frame) => frame.remove());
  pages.clear();
  document.documentElement.removeAttribute("data-vesper-theme");
  localStorage.clear();
  sessionStorage.clear();

  // the script's setup can't be undone, so tests only run it in their own pages (see `openPage`)
  expect(
    Reflect.has(window, Symbol.for("vesper-theme-persistence-script")),
  ).toBe(false);
});

describe("useTheme [storage]", () => {
  test("doesn't save the theme without a ThemePersistenceScript", async () => {
    const result = renderUseTheme();

    await changeTheme(() => result.current[1]("dark"));
    expect(localStorage).toHaveLength(0);
  });

  test("ignores other tabs without a ThemePersistenceScript", async () => {
    const result = renderUseTheme();

    await dispatchStorageEvent(STORAGE_KEY, "dark");
    expect(result.current[0]).toBe("system");
  });
});

describe("ThemePersistenceScript [unit]", () => {
  VESPER_THEMES.forEach((theme) => {
    test(`applies the saved ${theme} theme`, async () => {
      localStorage.setItem(STORAGE_KEY, theme);
      const page = await openPage();

      runPersistenceScript(page, STORAGE_KEY);
      expect(page.root).toHaveAttribute("data-vesper-theme", theme);
    });
  });

  test("ignores unknown saved themes", async () => {
    localStorage.setItem(STORAGE_KEY, "sepia");
    const page = await openPage();
    page.root.setAttribute("data-vesper-theme", "dark");

    runPersistenceScript(page, STORAGE_KEY);
    expect(page.root).toHaveAttribute("data-vesper-theme", "dark");
  });

  test("keeps the document's theme when no theme is saved", async () => {
    const page = await openPage();
    // eg. the server rendered the theme on the document from a cookie
    page.root.setAttribute("data-vesper-theme", "dark");

    runPersistenceScript(page, STORAGE_KEY);
    expect(page.root).toHaveAttribute("data-vesper-theme", "dark");
  });

  test("reads the theme from its storage key", async () => {
    localStorage.setItem("another-key", "dark");
    const page = await openPage();

    runPersistenceScript(page, STORAGE_KEY);
    expect(page.root).not.toHaveAttribute("data-vesper-theme");
  });

  test("saves the theme when it's set on the document", async () => {
    const page = await openPage();
    runPersistenceScript(page, STORAGE_KEY);

    page.root.setAttribute("data-vesper-theme", "dark");
    await waitForMutationObservers();
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  test("removes the saved theme when it's removed from the document", async () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const page = await openPage();
    runPersistenceScript(page, STORAGE_KEY);

    page.root.removeAttribute("data-vesper-theme");
    await waitForMutationObservers();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  test("doesn't save unknown themes", async () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const page = await openPage();
    runPersistenceScript(page, STORAGE_KEY);

    page.root.setAttribute("data-vesper-theme", "sepia");
    await waitForMutationObservers();
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  test("applies themes saved in other tabs", async () => {
    const page = await openPage();
    runPersistenceScript(page, STORAGE_KEY);

    await changeStorage(page, { key: STORAGE_KEY, newValue: "light" });
    expect(page.root).toHaveAttribute("data-vesper-theme", "light");
  });

  test("falls back to the system theme when another tab removes the saved theme", async () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const page = await openPage();
    runPersistenceScript(page, STORAGE_KEY);

    await changeStorage(page, { key: STORAGE_KEY, newValue: null });
    expect(page.root).not.toHaveAttribute("data-vesper-theme");
  });

  test("resets to the system theme when another tab clears storage", async () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const page = await openPage();
    runPersistenceScript(page, STORAGE_KEY);

    await changeStorage(page, { key: null, newValue: null });
    expect(page.root).not.toHaveAttribute("data-vesper-theme");

    // the system theme isn't saved back into the cleared storage
    await waitForMutationObservers();
    expect(localStorage).toHaveLength(0);
  });

  test("ignores other storage keys", async () => {
    const page = await openPage();
    runPersistenceScript(page, STORAGE_KEY);

    await changeStorage(page, { key: "another-key", newValue: "dark" });
    expect(page.root).not.toHaveAttribute("data-vesper-theme");
  });

  test("ignores unknown themes saved in other tabs", async () => {
    const page = await openPage();
    runPersistenceScript(page, STORAGE_KEY);

    await changeStorage(page, { key: STORAGE_KEY, newValue: "sepia" });
    expect(page.root).not.toHaveAttribute("data-vesper-theme");
  });

  test("ignores sessionStorage changes", async () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const page = await openPage();
    runPersistenceScript(page, STORAGE_KEY);

    // the page shares `sessionStorage` with the test's page, like frames on the same page do
    await changeStorage(page, {
      key: STORAGE_KEY,
      newValue: "light",
      area: "sessionStorage",
    });
    await changeStorage(page, {
      key: null,
      newValue: null,
      area: "sessionStorage",
    });
    expect(page.root).toHaveAttribute("data-vesper-theme", "dark");
  });

  test("only sets up once per page", async () => {
    const page = await openPage();
    runPersistenceScript(page, STORAGE_KEY);
    runPersistenceScript(page, "another-key");

    page.root.setAttribute("data-vesper-theme", "dark");
    await waitForMutationObservers();
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
    expect(localStorage.getItem("another-key")).toBeNull();
  });

  test("renders the nonce", () => {
    const template = document.createElement("template");
    template.innerHTML = renderToString(
      <ThemePersistenceScript storageKey={STORAGE_KEY} nonce="test-nonce" />,
    );

    expect(
      template.content.querySelector("script")?.getAttribute("nonce"),
    ).toBe("test-nonce");
  });
});
