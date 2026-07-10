import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";
import axe from "axe-core";

import { Toasts, addToast } from "@/components/toast/toast";
import {
  store,
  TOAST_VARIANTS,
  type ToastVariant,
} from "@/components/toast/store";

import "@/styles/test.css";

/**
 * Flush pending animation promises (duration: 0 via reduced-motion mock).
 * Uses requestAnimationFrame which is unaffected by vi.useFakeTimers().
 */
const flush = () => new Promise((r) => requestAnimationFrame(r));

beforeEach(() => {
  store.destroyAllToasts();
});

afterEach(() => {
  cleanup();
  store.destroyAllToasts();
});

describe("toast [unit]", () => {});

describe("toast [snapshot]", () => {});

describe("toast [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });
  });
});
