import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Combobox } from "@/components/combobox/combobox";

import "@/styles/test.css";

afterEach(cleanup);

describe("combobox [unit]", () => {
  test("renders null", () => {
    const { container } = render(<Combobox />);
    expect(container.firstChild).toBeNull();
  });
});

describe("combobox [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Combobox />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("combobox [a11y]", () => {
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
      const { container } = render(<Combobox />);

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
