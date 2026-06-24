import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Switch, SWITCH_SIZES } from "@/components/switch/switch";

import "@/styles/test.css";

afterEach(cleanup);

describe("switch [unit]", () => {
  test("renders null", () => {
    const { container } = render(<Switch />);
    expect(container.firstChild).toBeNull();
  });
});

describe("switch [snapshot]", () => {
  test("sm", async () => {
    const { container } = render(<Switch size="sm" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("sm, with label", async () => {
    const { container } = render(<Switch size="sm" label="Label" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("sm, disabled", async () => {
    const { container } = render(<Switch size="sm" disabled />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("sm, disabled, with label", async () => {
    const { container } = render(<Switch size="sm" disabled label="Label" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("md", async () => {
    const { container } = render(<Switch size="md" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("md, with label", async () => {
    const { container } = render(<Switch size="md" label="Label" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("md, disabled", async () => {
    const { container } = render(<Switch size="md" disabled />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("sm, disabled, with label", async () => {
    const { container } = render(<Switch size="sm" disabled label="Label" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("switch [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    SWITCH_SIZES.forEach((size) => {
      test(`wcag2aaa (${size}, ${theme})`, async () => {
        const { container } = render(<Switch size={size} label="Label" />);

        expect(
          await axe.run(container, { runOnly: "wcag2aaa" }),
        ).toHaveNoViolations();
      });
    });
  });
});
