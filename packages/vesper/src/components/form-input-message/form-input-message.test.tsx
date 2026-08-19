import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { FormInputMessage } from "@/components/form-input-message/form-input-message";

import "@/styles/test.css";

afterEach(cleanup);

describe("form-input-message [unit]", () => {
  test("renders a outpput", () => {
    const { container } = render(<FormInputMessage />);
    expect(container.firstElementChild?.tagName).toBe("OUTPUT");
  });
});

describe("form-input-message [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<FormInputMessage />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("form-input-message [a11y]", () => {
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
      const { container } = render(<FormInputMessage />);

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
