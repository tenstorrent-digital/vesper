import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { TextInput } from "@/components/text-input/text-input";

import "@/styles/test.css";

afterEach(cleanup);

describe("text-input [unit]", () => {
  test("renders a input", () => {
    const { container } = render(<TextInput />);
    expect(container.firstElementChild?.tagName).toBe("INPUT");
  });
});

describe("text-input [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<TextInput />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("text-input [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<TextInput />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
