import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { Textarea } from "@/components/textarea/textarea";

import "@/styles/test.css";

afterEach(cleanup);

describe("textarea [unit]", () => {
  test("renders a textarea", () => {
    const { container } = render(<Textarea />);
    expect(container.firstElementChild?.tagName).toBe("TEXTAREA");
  });
});

describe("textarea [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Textarea />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("textarea [a11y]", () => {
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
      const { container } = render(<Textarea />);

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
