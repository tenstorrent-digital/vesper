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
  test("subtle, sm", () => {
    const result = render(
      <TextButton variant="subtle" size="sm">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("subtle, sm, disabled", () => {
    const result = render(
      <TextButton variant="subtle" size="sm" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("subtle, md", () => {
    const result = render(
      <TextButton variant="subtle" size="md">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("subtle, md, disabled", () => {
    const result = render(
      <TextButton variant="subtle" size="md" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("subtle, lg", () => {
    const result = render(
      <TextButton variant="subtle" size="lg">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("subtle, lg, disabled", () => {
    const result = render(
      <TextButton variant="subtle" size="lg" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("contrast, sm", () => {
    const result = render(
      <TextButton variant="contrast" size="sm">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("contrast, sm, disabled", () => {
    const result = render(
      <TextButton variant="contrast" size="sm" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("contrast, md", () => {
    const result = render(
      <TextButton variant="contrast" size="md">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("contrast, md, disabled", () => {
    const result = render(
      <TextButton variant="contrast" size="md" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("contrast, lg", () => {
    const result = render(
      <TextButton variant="contrast" size="lg">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("contrast, lg, disabled", () => {
    const result = render(
      <TextButton variant="contrast" size="lg" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("accent, sm", () => {
    const result = render(
      <TextButton variant="accent" size="sm">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("accent, sm, disabled", () => {
    const result = render(
      <TextButton variant="accent" size="sm" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("accent, md", () => {
    const result = render(
      <TextButton variant="accent" size="md">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("accent, md, disabled", () => {
    const result = render(
      <TextButton variant="accent" size="md" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("accent, lg", () => {
    const result = render(
      <TextButton variant="accent" size="lg">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("accent, lg, disabled", () => {
    const result = render(
      <TextButton variant="accent" size="lg" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("success, sm", () => {
    const result = render(
      <TextButton variant="success" size="sm">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("success, sm, disabled", () => {
    const result = render(
      <TextButton variant="success" size="sm" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("success, md", () => {
    const result = render(
      <TextButton variant="success" size="md">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("success, md, disabled", () => {
    const result = render(
      <TextButton variant="success" size="md" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("success, lg", () => {
    const result = render(
      <TextButton variant="success" size="lg">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("success, lg, disabled", () => {
    const result = render(
      <TextButton variant="success" size="lg" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("warning, sm", () => {
    const result = render(
      <TextButton variant="warning" size="sm">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("warning, sm, disabled", () => {
    const result = render(
      <TextButton variant="warning" size="sm" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("warning, md", () => {
    const result = render(
      <TextButton variant="warning" size="md">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("warning, md, disabled", () => {
    const result = render(
      <TextButton variant="warning" size="md" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("warning, lg", () => {
    const result = render(
      <TextButton variant="warning" size="lg">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("warning, lg, disabled", () => {
    const result = render(
      <TextButton variant="warning" size="lg" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("danger, sm", () => {
    const result = render(
      <TextButton variant="danger" size="sm">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("danger, sm, disabled", () => {
    const result = render(
      <TextButton variant="danger" size="sm" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("danger, md", () => {
    const result = render(
      <TextButton variant="danger" size="md">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("danger, md, disabled", () => {
    const result = render(
      <TextButton variant="danger" size="md" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("danger, lg", () => {
    const result = render(
      <TextButton variant="danger" size="lg">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("danger, lg, disabled", () => {
    const result = render(
      <TextButton variant="danger" size="lg" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("info, sm", () => {
    const result = render(
      <TextButton variant="info" size="sm">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("info, sm, disabled", () => {
    const result = render(
      <TextButton variant="info" size="sm" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("info, md", () => {
    const result = render(
      <TextButton variant="info" size="md">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("info, md, disabled", () => {
    const result = render(
      <TextButton variant="info" size="md" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("info, lg", () => {
    const result = render(
      <TextButton variant="info" size="lg">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("info, lg, disabled", () => {
    const result = render(
      <TextButton variant="info" size="lg" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("purple, sm", () => {
    const result = render(
      <TextButton variant="purple" size="sm">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("purple, sm, disabled", () => {
    const result = render(
      <TextButton variant="purple" size="sm" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("purple, md", () => {
    const result = render(
      <TextButton variant="purple" size="md">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("purple, md, disabled", () => {
    const result = render(
      <TextButton variant="purple" size="md" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("purple, lg", () => {
    const result = render(
      <TextButton variant="purple" size="lg">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("purple, lg, disabled", () => {
    const result = render(
      <TextButton variant="purple" size="lg" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("pink, sm", () => {
    const result = render(
      <TextButton variant="pink" size="sm">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("pink, sm, disabled", () => {
    const result = render(
      <TextButton variant="pink" size="sm" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("pink, md", () => {
    const result = render(
      <TextButton variant="pink" size="md">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("pink, md, disabled", () => {
    const result = render(
      <TextButton variant="pink" size="md" disabled>
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("pink, lg", () => {
    const result = render(
      <TextButton variant="pink" size="lg">
        Button Text
      </TextButton>,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test("pink, lg, disabled", () => {
    const result = render(
      <TextButton variant="pink" size="lg" disabled>
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

      test(`wcag2aaa (contrast, sm, ${theme})`, async () => {
        const result = render(
          <TextButton variant="contrast" size="sm">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (contrast, sm, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="contrast" size="sm" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (contrast, md, ${theme})`, async () => {
        const result = render(
          <TextButton variant="contrast" size="md">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (contrast, md, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="contrast" size="md" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (contrast, lg, ${theme})`, async () => {
        const result = render(
          <TextButton variant="contrast" size="lg">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (contrast, lg, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="contrast" size="lg" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (info, sm, ${theme})`, async () => {
        const result = render(
          <TextButton variant="info" size="sm">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (info, sm, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="info" size="sm" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (info, md, ${theme})`, async () => {
        const result = render(
          <TextButton variant="info" size="md">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (info, md, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="info" size="md" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (info, lg, ${theme})`, async () => {
        const result = render(
          <TextButton variant="info" size="lg">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (info, lg, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="info" size="lg" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (purple, sm, ${theme})`, async () => {
        const result = render(
          <TextButton variant="purple" size="sm">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (purple, sm, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="purple" size="sm" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (purple, md, ${theme})`, async () => {
        const result = render(
          <TextButton variant="purple" size="md">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (purple, md, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="purple" size="md" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (purple, lg, ${theme})`, async () => {
        const result = render(
          <TextButton variant="purple" size="lg">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (purple, lg, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="purple" size="lg" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (pink, sm, ${theme})`, async () => {
        const result = render(
          <TextButton variant="pink" size="sm">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (pink, sm, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="pink" size="sm" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (pink, md, ${theme})`, async () => {
        const result = render(
          <TextButton variant="pink" size="md">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (pink, md, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="pink" size="md" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (pink, lg, ${theme})`, async () => {
        const result = render(
          <TextButton variant="pink" size="lg">
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (pink, lg, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="pink" size="lg" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      // subtle: todo in dark (non-disabled only)
      if (theme === "dark") {
        test.todo(`wcag2aaa (subtle, sm, ${theme})`);

        test.todo(`wcag2aaa (subtle, md, ${theme})`);

        test.todo(`wcag2aaa (subtle, lg, ${theme})`);
      } else {
        test(`wcag2aaa (subtle, sm, ${theme})`, async () => {
          const result = render(
            <TextButton variant="subtle" size="sm">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (subtle, md, ${theme})`, async () => {
          const result = render(
            <TextButton variant="subtle" size="md">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (subtle, lg, ${theme})`, async () => {
          const result = render(
            <TextButton variant="subtle" size="lg">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });
      }

      test(`wcag2aaa (subtle, sm, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="subtle" size="sm" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (subtle, md, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="subtle" size="md" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (subtle, lg, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="subtle" size="lg" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      // accent, success, warning, danger: todo in light (non-disabled only)
      if (theme === "light") {
        test.todo(`wcag2aaa (accent, sm, ${theme})`);

        test.todo(`wcag2aaa (accent, md, ${theme})`);

        test.todo(`wcag2aaa (accent, lg, ${theme})`);

        test.todo(`wcag2aaa (success, sm, ${theme})`);

        test.todo(`wcag2aaa (success, md, ${theme})`);

        test.todo(`wcag2aaa (success, lg, ${theme})`);

        test.todo(`wcag2aaa (warning, sm, ${theme})`);

        test.todo(`wcag2aaa (warning, md, ${theme})`);

        test.todo(`wcag2aaa (warning, lg, ${theme})`);

        test.todo(`wcag2aaa (danger, sm, ${theme})`);

        test.todo(`wcag2aaa (danger, md, ${theme})`);

        test.todo(`wcag2aaa (danger, lg, ${theme})`);
      } else {
        test(`wcag2aaa (accent, sm, ${theme})`, async () => {
          const result = render(
            <TextButton variant="accent" size="sm">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (accent, md, ${theme})`, async () => {
          const result = render(
            <TextButton variant="accent" size="md">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (accent, lg, ${theme})`, async () => {
          const result = render(
            <TextButton variant="accent" size="lg">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (success, sm, ${theme})`, async () => {
          const result = render(
            <TextButton variant="success" size="sm">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (success, md, ${theme})`, async () => {
          const result = render(
            <TextButton variant="success" size="md">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (success, lg, ${theme})`, async () => {
          const result = render(
            <TextButton variant="success" size="lg">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (warning, sm, ${theme})`, async () => {
          const result = render(
            <TextButton variant="warning" size="sm">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (warning, md, ${theme})`, async () => {
          const result = render(
            <TextButton variant="warning" size="md">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (warning, lg, ${theme})`, async () => {
          const result = render(
            <TextButton variant="warning" size="lg">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (danger, sm, ${theme})`, async () => {
          const result = render(
            <TextButton variant="danger" size="sm">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (danger, md, ${theme})`, async () => {
          const result = render(
            <TextButton variant="danger" size="md">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });

        test(`wcag2aaa (danger, lg, ${theme})`, async () => {
          const result = render(
            <TextButton variant="danger" size="lg">
              Button Text
            </TextButton>,
          );

          expect(
            await axe.run(result.container, {
              runOnly: "wcag2aaa",
            }),
          ).toHaveNoViolations();
        });
      }

      test(`wcag2aaa (accent, sm, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="accent" size="sm" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (accent, md, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="accent" size="md" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (accent, lg, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="accent" size="lg" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (success, sm, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="success" size="sm" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (success, md, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="success" size="md" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (success, lg, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="success" size="lg" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (warning, sm, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="warning" size="sm" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (warning, md, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="warning" size="md" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (warning, lg, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="warning" size="lg" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (danger, sm, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="danger" size="sm" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (danger, md, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="danger" size="md" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });

      test(`wcag2aaa (danger, lg, disabled, ${theme})`, async () => {
        const result = render(
          <TextButton variant="danger" size="lg" disabled>
            Button Text
          </TextButton>,
        );

        expect(
          await axe.run(result.container, {
            runOnly: "wcag2aaa",
          }),
        ).toHaveNoViolations();
      });
    });
  });
});
