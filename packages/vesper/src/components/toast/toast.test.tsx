import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Toast } from "@/components/toast/toast";

import "@/styles/test.css";

afterEach(cleanup);

describe("toast [unit]", () => {
  test("renders null", () => {
    const { container } = render(<Toast />);
    expect(container.firstChild).toBeNull();
  });
});

describe("toast [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Toast />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

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

    test(`a11y (${theme})`, async () => {
      const { container } = render(<Toast />);

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
