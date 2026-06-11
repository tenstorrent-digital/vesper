import { render, within, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import axe from "axe-core";
import { Button, type ButtonProps } from "@repo/vesper/button";
import { Tenstorrent } from "@repo/vesper/icons";

import "@repo/vesper/styles.css";

const VARIANTS: ButtonProps["variant"][] = [
  "contrast",
  "danger",
  "ghost",
  "primary",
  "subtle",
  "tertiary",
  "warning",
];

const SIZES: ButtonProps["size"][] = ["lg", "md", "sm", "xs"];

const BUTTON_PERMUTATIONS: ButtonProps[] = VARIANTS.flatMap((variant) =>
  SIZES.flatMap((size) => [
    { size, variant, disabled: false },
    { size, variant, disabled: true },
  ]),
);

afterEach(cleanup);

describe("Button [unit]", () => {
  VARIANTS.forEach((variant) => {
    it(`applies the correct variant class when variant is set to "${variant}"`, () => {
      const result = render(
        <Button size="lg" variant={variant}>
          {variant}
        </Button>,
      );
      const view = within(result.container);

      expect(view.getByRole("button")).toHaveClass(`vesper-button-${variant}`);
    });
  });

  SIZES.forEach((size) => {
    it(`applies the correct size class when size is set to "${size}"`, () => {
      const result = render(
        <Button size={size} variant="primary">
          {size}
        </Button>,
      );
      const view = within(result.container);

      expect(view.getByRole("button")).toHaveClass(`vesper-button-${size}`);
    });
  });

  it("sets the disabled attribute when disabled", () => {
    const result = render(
      <Button size="md" variant="primary" disabled>
        Disabled
      </Button>,
    );
    const view = within(result.container);
    expect(view.getByRole("button")).toBeDisabled();
  });

  it("applies disabled variant class when disabled", () => {
    const result = render(
      <Button size="md" variant="primary" disabled>
        Disabled
      </Button>,
    );
    const view = within(result.container);
    expect(view.getByRole("button")).toHaveClass("vesper-button-disabled");
    expect(view.getByRole("button")).not.toHaveClass("vesper-button-primary");
  });

  it("renders iconLeft when provided", () => {
    const result = render(
      <Button
        size="md"
        variant="primary"
        iconLeft={<Tenstorrent data-testid="icon-left" />}
      >
        With Icon Left
      </Button>,
    );
    const view = within(result.container);
    expect(view.getByTestId("icon-left")).toBeDefined();
  });

  it("renders iconRight when provided", () => {
    const result = render(
      <Button
        size="md"
        variant="primary"
        iconRight={<Tenstorrent data-testid="icon-right" />}
      >
        With Icon Right
      </Button>,
    );
    const view = within(result.container);
    expect(view.getByTestId("icon-right")).toBeDefined();
  });

  it("renders iconLeft and iconRight when provided", () => {
    const result = render(
      <Button
        size="md"
        variant="primary"
        iconLeft={<Tenstorrent data-testid="icon-left" />}
        iconRight={<Tenstorrent data-testid="icon-right" />}
      >
        With Icon Left and Right
      </Button>,
    );
    const view = within(result.container);
    expect(view.getByTestId("icon-left")).toBeDefined();
    expect(view.getByTestId("icon-right")).toBeDefined();
  });

  it('renders as a custom element via the "as" prop', () => {
    const result = render(
      <Button as="a" href="/link" size="md" variant="primary">
        As Link
      </Button>,
    );
    const view = within(result.container);
    const link = view.getByRole("link");
    expect(link).toHaveTextContent("Link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/link");
  });

  it("passes additional props through to the element", () => {
    const result = render(
      <Button size="md" variant="primary" aria-label="custom label">
        With Aria Label
      </Button>,
    );
    const view = within(result.container);
    expect(view.getByRole("button")).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  it("merges custom className with component classes", () => {
    const result = render(
      <Button size="md" variant="primary" className="custom-class">
        Styled
      </Button>,
    );
    const view = within(result.container);
    const btn = view.getByRole("button");
    expect(btn).toHaveClass("vesper-button");
    expect(btn).toHaveClass("vesper-button-primary");
    expect(btn).toHaveClass("vesper-button-md");
    expect(btn).toHaveClass("custom-class");
  });
});

describe("Button [snapshot]", () => {
  BUTTON_PERMUTATIONS.forEach((permutation) => {
    const { size, variant, disabled } = permutation;

    it(`renders correctly when variant="${variant}", size="${size}", disabled={${disabled}}`, () => {
      const result = render(<Button {...permutation}>Button Text</Button>);

      const button = within(result.container).getByRole("button");
      expect(button).toMatchSnapshot();
    });
  });
});

describe("Button [a11y]", () => {
  BUTTON_PERMUTATIONS.forEach((permutation) => {
    const { size, variant, disabled } = permutation;

    it(`renders without wcag2aaa violations when variant="${variant}", size="${size}", disabled={${disabled}}`, async () => {
      const result = render(<Button {...permutation}>Button Text</Button>);

      const button = within(result.container).getByRole("button");
      expect(
        await axe.run(button, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
