import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { RadioGroup } from "@/components/radio-group/radio-group";

import "@/styles/test.css";

afterEach(cleanup);

describe("radio-group [unit]", () => {
  test("renders null", () => {
    const { container } = render(<RadioGroup options={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("radio-group [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<RadioGroup options={[]} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("radio-group [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<RadioGroup options={[]} />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
