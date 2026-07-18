import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Material } from "@/components/material/material";

import "@/styles/test.css";

afterEach(cleanup);

describe("material [unit]", () => {
  test("renders a div", () => {
    const { container } = render(<Material />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });
});

describe("material [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Material />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("material [a11y]", () => {
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
      const { container } = render(<Material />);

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
