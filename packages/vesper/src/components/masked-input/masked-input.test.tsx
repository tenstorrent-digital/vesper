import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { MaskedInput } from "@/components/masked-input/masked-input";

import "@/styles/test.css";

afterEach(cleanup);

describe("masked-input [unit]", () => {
  test("renders an input", () => {
    const result = render(<MaskedInput />);
    expect(result.getByRole("textbox").tagName).toBe("INPUT");
  });
});

describe("masked-input [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<MaskedInput />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("masked-input [a11y]", () => {
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
      const { container } = render(<MaskedInput />);

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
