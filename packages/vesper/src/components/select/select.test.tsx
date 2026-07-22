import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Select } from "@/components/select/select";

import "@/styles/test.css";

afterEach(cleanup);

describe("select [unit]", () => {
  test("renders null", () => {
    const { container } = render(<Select />);
    expect(container.firstChild).toBeNull();
  });
});

describe("select [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Select />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("select [a11y]", () => {
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
      const { container } = render(<Select />);

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
