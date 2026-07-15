import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Snippet } from "@/components/snippet/snippet";

import "@/styles/test.css";

afterEach(cleanup);

describe("snippet [unit]", () => {
  test("renders a pre", () => {
    const { container } = render(<Snippet />);
    expect(container.firstElementChild?.tagName).toBe("PRE");
  });
});

describe("snippet [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Snippet />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("snippet [a11y]", () => {
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
      const { container } = render(<Snippet />);

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
