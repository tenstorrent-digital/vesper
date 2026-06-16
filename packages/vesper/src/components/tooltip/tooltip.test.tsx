import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it } from "vitest";
import axe from "axe-core";
import { Tooltip } from "@/components/tooltip/tooltip";

import "@/styles/styles.css";

afterEach(cleanup);

describe("tooltip [unit]", () => {
  it("renders null", () => {
    const { container } = render(<Tooltip />);
    expect(container.firstChild).toBeNull();
  });
});

describe("tooltip [snapshot]", () => {
  it("renders correctly", async () => {
    const result = render(<Tooltip />);

    expect(result.container.firstChild).toMatchSnapshot();
  });
});

describe("tooltip [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    it(`wcag2aaa (${theme})`, async () => {
      const result = render(<Tooltip />);

      expect(
        await axe.run(result.container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
