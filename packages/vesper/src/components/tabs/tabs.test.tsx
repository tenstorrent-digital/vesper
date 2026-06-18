import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Tabs } from "@/components/tabs/tabs";

import "@/styles/test.css";

afterEach(cleanup);

describe("tabs [unit]", () => {
  test("renders null", () => {
    const { container } = render(<Tabs />);
    expect(container.firstChild).toBeNull();
  });
});

describe("tabs [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Tabs />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("tabs [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<Tabs />);

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
