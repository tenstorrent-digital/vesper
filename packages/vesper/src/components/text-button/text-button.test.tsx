import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import {
  TextButton,
  TEXT_BUTTON_SIZES,
  TEXT_BUTTON_VARIANTS,
} from "@/components/text-button/text-button";
import { Tenstorrent } from "@/components/icons/icons";

import "@/styles/test.css";

afterEach(cleanup);

describe("text-button [unit]", () => {
  TEXT_BUTTON_VARIANTS.forEach((variant) => {
    test(`${variant} variant class`, () => {
      const result = render(
        <TextButton variant={variant}>{variant}</TextButton>,
      );

      expect(result.container.firstChild).toHaveClass(
        `vesper-text-button-${variant}`,
      );
    });
  });

  TEXT_BUTTON_SIZES.forEach((size) => {
    test(`${size} size class`, () => {
      const result = render(<TextButton size={size}>{size}</TextButton>);

      expect(result.container.firstChild).toHaveClass(
        `vesper-text-button-${size}`,
      );
    });
  });

  test("disabled", () => {
    const result = render(
      <TextButton disabled variant="accent">
        Disabled
      </TextButton>,
    );

    expect(result.container.firstChild).toBeDisabled();
    expect(result.container.firstChild).toHaveClass(
      "vesper-text-button-disabled",
    );
    expect(result.container.firstChild).not.toHaveClass(
      "vesper-text-button-accent",
    );
  });

  test("renders iconLeft", () => {
    const result = render(
      <TextButton size="md" iconLeft={<Tenstorrent data-testid="icon-left" />}>
        With Icon Left
      </TextButton>,
    );

    const view = within(result.container);
    expect(view.getByTestId("icon-left")).toBeDefined();
  });

  test("renders iconRight", () => {
    const result = render(
      <TextButton
        size="md"
        iconRight={<Tenstorrent data-testid="icon-right" />}
      >
        With Icon Right
      </TextButton>,
    );

    const view = within(result.container);
    expect(view.getByTestId("icon-right")).toBeDefined();
  });

  test("renders iconLeft and iconRight", () => {
    const result = render(
      <TextButton
        size="md"
        iconLeft={<Tenstorrent data-testid="icon-left" />}
        iconRight={<Tenstorrent data-testid="icon-right" />}
      >
        With Icon Left and Right
      </TextButton>,
    );
    const view = within(result.container);

    expect(view.getByTestId("icon-left")).toBeDefined();
    expect(view.getByTestId("icon-right")).toBeDefined();
  });

  test("polymorphism", () => {
    const result = render(
      <TextButton as="a" href="/link">
        As Link
      </TextButton>,
    );
    const view = within(result.container);
    const link = view.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/link");
  });

  test("additional prop passthrough", () => {
    const result = render(
      <TextButton aria-label="custom label">With Aria Label</TextButton>,
    );

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("custom className", () => {
    const result = render(
      <TextButton className="custom-class" size="md" variant="accent">
        Styled
      </TextButton>,
    );

    const btn = result.container.firstChild;
    expect(btn).toHaveClass("vesper-text-button");
    expect(btn).toHaveClass("vesper-text-button-accent");
    expect(btn).toHaveClass("vesper-text-button-md");
    expect(btn).toHaveClass("custom-class");
  });
});

describe("text-button [snapshot]", () => {
  // 1 case for each variant
  test("variant: subtle", () => {
    const result = render(
      <TextButton variant="subtle" size="md">
        Button Text
      </TextButton>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: contrast", () => {
    const result = render(
      <TextButton variant="contrast" size="md">
        Button Text
      </TextButton>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: accent", () => {
    const result = render(
      <TextButton variant="accent" size="md">
        Button Text
      </TextButton>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: success", () => {
    const result = render(
      <TextButton variant="success" size="md">
        Button Text
      </TextButton>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: warning", () => {
    const result = render(
      <TextButton variant="warning" size="md">
        Button Text
      </TextButton>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: danger", () => {
    const result = render(
      <TextButton variant="danger" size="md">
        Button Text
      </TextButton>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: info", () => {
    const result = render(
      <TextButton variant="info" size="md">
        Button Text
      </TextButton>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: purple", () => {
    const result = render(
      <TextButton variant="purple" size="md">
        Button Text
      </TextButton>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("variant: pink", () => {
    const result = render(
      <TextButton variant="pink" size="md">
        Button Text
      </TextButton>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  // 1 case for each size
  test("size: sm", () => {
    const result = render(
      <TextButton variant="contrast" size="sm">
        Button Text
      </TextButton>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("size: md", () => {
    const result = render(
      <TextButton variant="contrast" size="md">
        Button Text
      </TextButton>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("size: lg", () => {
    const result = render(
      <TextButton variant="contrast" size="lg">
        Button Text
      </TextButton>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });

  // 1 case for disabled
  test("disabled", () => {
    const result = render(
      <TextButton variant="accent" size="md" disabled>
        Button Text
      </TextButton>,
    );
    expect(result.container.firstChild).toMatchSnapshot();
  });
});

describe("text-button [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    describe(`${theme} mode`, () => {
      beforeEach(() => {
        document.documentElement.setAttribute("data-vesper-theme", theme);
      });

      afterEach(() => {
        document.documentElement.removeAttribute("data-vesper-theme");
      });

      // 1 case for each variant
      // subtle: todo in dark
      if (theme === "dark") {
        test.todo(`wcag2aaa (variant: subtle, ${theme})`);
      } else {
        test(`wcag2aaa (variant: subtle, ${theme})`, async () => {
          const result = render(
            <TextButton variant="subtle" size="md">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, { runOnly: "wcag2aaa" }),
          ).toHaveNoViolations();
        });
      }

      test(`wcag2aaa (variant: contrast, ${theme})`, async () => {
        const result = render(
          <TextButton variant="contrast" size="md">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, { runOnly: "wcag2aaa" }),
        ).toHaveNoViolations();
      });

      // accent, success, warning, danger: todo in light
      if (theme === "light") {
        test.todo(`wcag2aaa (variant: accent, ${theme})`);
        test.todo(`wcag2aaa (variant: success, ${theme})`);
        test.todo(`wcag2aaa (variant: warning, ${theme})`);
        test.todo(`wcag2aaa (variant: danger, ${theme})`);
      } else {
        test(`wcag2aaa (variant: accent, ${theme})`, async () => {
          const result = render(
            <TextButton variant="accent" size="md">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, { runOnly: "wcag2aaa" }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (variant: success, ${theme})`, async () => {
          const result = render(
            <TextButton variant="success" size="md">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, { runOnly: "wcag2aaa" }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (variant: warning, ${theme})`, async () => {
          const result = render(
            <TextButton variant="warning" size="md">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, { runOnly: "wcag2aaa" }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (variant: danger, ${theme})`, async () => {
          const result = render(
            <TextButton variant="danger" size="md">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, { runOnly: "wcag2aaa" }),
          ).toHaveNoViolations();
        });
      }

      test(`wcag2aaa (variant: info, ${theme})`, async () => {
        const result = render(
          <TextButton variant="info" size="md">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, { runOnly: "wcag2aaa" }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (variant: purple, ${theme})`, async () => {
        const result = render(
          <TextButton variant="purple" size="md">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, { runOnly: "wcag2aaa" }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (variant: pink, ${theme})`, async () => {
        const result = render(
          <TextButton variant="pink" size="md">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, { runOnly: "wcag2aaa" }),
        ).toHaveNoViolations();
      });

      // 1 case for each size
      test(`wcag2aaa (size: sm, ${theme})`, async () => {
        const result = render(
          <TextButton variant="contrast" size="sm">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, { runOnly: "wcag2aaa" }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (size: md, ${theme})`, async () => {
        const result = render(
          <TextButton variant="contrast" size="md">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, { runOnly: "wcag2aaa" }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (size: lg, ${theme})`, async () => {
        const result = render(
          <TextButton variant="contrast" size="lg">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, { runOnly: "wcag2aaa" }),
        ).toHaveNoViolations();
      });

      // 1 case for disabled
      test(`wcag2aaa (disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="accent" size="md" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, { runOnly: "wcag2aaa" }),
        ).toHaveNoViolations();
      });
    });
  });
});
