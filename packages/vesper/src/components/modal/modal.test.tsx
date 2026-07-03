import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Modal } from "@/components/modal/modal";

import "@/styles/test.css";

afterEach(cleanup);

describe("modal [unit]", () => {
  test("renders a dialog", () => {
    const { container } = render(<Modal />);
    expect(container.firstElementChild?.tagName).toBe("DIALOG");
  });
});

describe("modal [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<Modal />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("modal [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`a11y (${theme})`, async () => {
      const { container } = render(<Modal />);

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
