import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Toggle } from "@/components/toggle/toggle";
import { Globe, Tenstorrent } from "@/components/icons/icons";

import "@/styles/test.css";

afterEach(cleanup);

describe("toggle [unit]", () => {});

describe("toggle [snapshot]", () => {
  test("text options", async () => {
    const { container } = render(
      <Toggle
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "aria-label A" },
          { text: "Option B", value: "option-b", ariaLabel: "aria-label B" },
        ]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("icon options", async () => {
    const { container } = render(
      <Toggle
        options={[
          { icon: <Globe />, value: "option-a", ariaLabel: "aria-label A" },
          {
            icon: <Tenstorrent />,
            value: "option-b",
            ariaLabel: "aria-label B",
          },
        ]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("mixed options", async () => {
    const { container } = render(
      <Toggle
        options={[
          { text: "Option A", value: "option-a", ariaLabel: "aria-label A" },
          {
            icon: <Tenstorrent />,
            value: "option-b",
            ariaLabel: "aria-label B",
          },
        ]}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("toggle [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (text, ${theme})`, async () => {
      const { container } = render(
        <Toggle
          options={[
            { text: "Option A", value: "option-a", ariaLabel: "aria-label A" },
            { text: "Option B", value: "option-b", ariaLabel: "aria-label B" },
          ]}
        />,
      );

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (icons, ${theme})`, async () => {
      const { container } = render(
        <Toggle
          options={[
            { icon: <Globe />, value: "option-a", ariaLabel: "aria-label A" },
            {
              icon: <Tenstorrent />,
              value: "option-b",
              ariaLabel: "aria-label B",
            },
          ]}
        />,
      );

      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
