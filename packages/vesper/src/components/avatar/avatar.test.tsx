import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Avatar, AVATAR_SIZES } from "@/components/avatar/avatar";

import "@/styles/test.css";

afterEach(cleanup);

describe("avatar [unit]", () => {
  AVATAR_SIZES.forEach((size) => {
    test(`applies the correct size class when size is set to "${size}"`, () => {
      const result = render(<Avatar size={size} />);
      expect(result.container.firstChild).toHaveClass(`vesper-avatar-${size}`);
    });
  });

  test("img renders when src present", () => {
    const result = render(
      <Avatar src="https://unsplash.it/300/300" alt="avatar alt text" />,
    );
    const image = within(result.container).getByRole("img");
    expect(image).toBeDefined();
    expect(image).toHaveAttribute("src", "https://unsplash.it/300/300");
    expect(image).toHaveAttribute("alt", "avatar alt text");
  });

  test("img missing when src undefined", () => {
    const result = render(<Avatar />);
    const image = result.container.querySelector("img");
    expect(image).toBeNull();
  });

  test("alt is empty string not provided", () => {
    const result = render(<Avatar src="https://unsplash.it/300/300" />);
    const image = result.container.querySelector("img");
    expect(image).toHaveAttribute("alt", "");
  });

  test("polymorphism", () => {
    const result = render(<Avatar as="a" href="/link" />);
    const view = within(result.container);
    const link = view.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/link");
  });

  test("additional prop passthrough", () => {
    const result = render(<Avatar aria-label="custom label" />);

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("custom className", () => {
    const result = render(<Avatar size="md" className="custom-class" />);

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-avatar-md");
    expect(el).toHaveClass("custom-class");
  });
});

describe("avatar [snapshot]", () => {
  AVATAR_SIZES.forEach((size) => {
    test(`${size}`, () => {
      const result = render(<Avatar size={size} />);

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("avatar [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    AVATAR_SIZES.forEach((size) => {
      test(`a11y (${size}, ${theme})`, async () => {
        const result = render(
          <Avatar size={size} src="https://unsplash.it/300/300" />,
        );

        expect(await axe.run(result.container)).toHaveNoViolations();
      });
    });
  });
});
