import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { Button } from "./button";
import { expectA11y } from "../../utils/expectA11y";

describe("Button a11y", () => {
  it.each(["primary", "contrast", "subtle", "tertiary", "ghost"] as const)(
    "has no violations for variant: %s",
    async (variant) => {
      const { container } = render(
        <Button size="md" variant={variant}>
          {variant}
        </Button>,
      );
      await expectA11y(container);
    },
  );

  // TODO: fix color-contrast violation for danger and warning variants
  it.todo("has no violations for variant: danger");
  it.todo("has no violations for variant: warning");

  it("has no violations across all sizes", async () => {
    const sizes = ["lg", "md", "sm", "xs"] as const;

    for (const size of sizes) {
      const { container } = render(
        <Button size={size} variant="primary">
          {size}
        </Button>,
      );
      await expectA11y(container);
    }
  });

  it("has no violations when rendered as a link", async () => {
    const { container } = render(
      <Button as="a" href="https://example.com" size="md" variant="primary">
        Link button
      </Button>,
    );
    await expectA11y(container);
  });

  it("has no violations when disabled", async () => {
    const { container } = render(
      <Button size="md" variant="primary" disabled>
        Disabled
      </Button>,
    );
    await expectA11y(container);
  });
});
