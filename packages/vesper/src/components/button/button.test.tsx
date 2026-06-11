import { render, within, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "@repo/vesper/button";

afterEach(cleanup);

describe("Button", () => {
  it("renders children as text content", () => {
    const { container } = render(
      <Button size="md" variant="primary">
        Hello
      </Button>,
    );
    const view = within(container);
    expect(view.getByRole("button")).toHaveTextContent("Hello");
  });

  it("applies the correct variant class", () => {
    const { container } = render(
      <Button size="md" variant="danger">
        Delete
      </Button>,
    );
    const view = within(container);
    expect(view.getByRole("button")).toHaveClass("vesper-button-danger");
  });

  it("applies the correct size class", () => {
    const { container } = render(
      <Button size="xs" variant="primary">
        Tiny
      </Button>,
    );
    const view = within(container);
    expect(view.getByRole("button")).toHaveClass("vesper-button-xs");
  });

  it("sets the disabled attribute when disabled", () => {
    const { container } = render(
      <Button size="md" variant="primary" disabled>
        Disabled
      </Button>,
    );
    const view = within(container);
    expect(view.getByRole("button")).toBeDisabled();
  });

  it("applies disabled variant class when disabled", () => {
    const { container } = render(
      <Button size="md" variant="primary" disabled>
        Disabled
      </Button>,
    );
    const view = within(container);
    expect(view.getByRole("button")).toHaveClass("vesper-button-disabled");
    expect(view.getByRole("button")).not.toHaveClass("vesper-button-primary");
  });

  it("renders iconLeft when provided", () => {
    const { container } = render(
      <Button size="md" variant="primary" iconLeft={<svg data-testid="icon" />}>
        With Icon
      </Button>,
    );
    const view = within(container);
    expect(view.getByTestId("icon")).toBeDefined();
    expect(
      view.getByRole("button").querySelector(".vesper-button-icon"),
    ).not.toBeNull();
  });

  it("renders iconRight when provided", () => {
    const { container } = render(
      <Button
        size="md"
        variant="primary"
        iconRight={<svg data-testid="icon-right" />}
      >
        With Icon
      </Button>,
    );
    const view = within(container);
    expect(view.getByTestId("icon-right")).toBeDefined();
  });

  it("renders as a custom element via the 'as' prop", () => {
    const { container } = render(
      <Button as="a" href="/link" size="md" variant="primary">
        Link
      </Button>,
    );
    const view = within(container);
    const link = view.getByRole("link");
    expect(link).toHaveTextContent("Link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/link");
  });

  it("passes additional props through to the element", () => {
    const { container } = render(
      <Button size="md" variant="primary" aria-label="custom label">
        Btn
      </Button>,
    );
    const view = within(container);
    expect(view.getByRole("button")).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  it("merges custom className with component classes", () => {
    const { container } = render(
      <Button size="md" variant="primary" className="custom-class">
        Styled
      </Button>,
    );
    const view = within(container);
    const btn = view.getByRole("button");
    expect(btn).toHaveClass("vesper-button");
    expect(btn).toHaveClass("custom-class");
  });
});
