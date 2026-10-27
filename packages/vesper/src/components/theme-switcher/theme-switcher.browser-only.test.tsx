import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import {
  ThemePersistenceScript,
  ThemeSwitcher,
} from "@/components/theme-switcher/theme-switcher";

/**
 * This test has its own file because it sets up the `ThemePersistenceScript` in the test's page, which can't be
 * undone while the page is open. Each test file runs in its own page, so the setup can't affect any other tests
 */

const STORAGE_KEY = "vesper-theme-test";

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

test("useTheme sets up the ThemePersistenceScript when react renders it in the browser", async () => {
  // react never runs scripts it renders in the browser, and logs an error saying so
  vi.spyOn(console, "error").mockImplementation(() => {});
  localStorage.setItem(STORAGE_KEY, "dark");

  // like an app that doesn't server render
  const result = render(
    <>
      <ThemePersistenceScript storageKey={STORAGE_KEY} />
      <ThemeSwitcher />
    </>,
  );
  expect(document.documentElement).toHaveAttribute("data-vesper-theme", "dark");
  expect(
    result.container.querySelector(".vesper-theme-switcher"),
  ).toHaveAttribute("data-vesper-theme", "dark");

  // mutation observers are notified in a microtask, after the click
  await act(async () =>
    fireEvent.click(
      result.getByRole("button", { name: "Switch color theme to light mode" }),
    ),
  );
  expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
});
