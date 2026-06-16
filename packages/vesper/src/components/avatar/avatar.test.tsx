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

  test("renders an image when src is present", () => {
    const result = render(
      <Avatar src="https://unsplash.it/300/300" alt="avatar alt text" />,
    );
    const image = within(result.container).getByRole("img");
    expect(image).toBeDefined();
    expect(image).toHaveAttribute("src", "https://unsplash.it/300/300");
    expect(image).toHaveAttribute("alt", "avatar alt text");
  });

  test("does not render an image when src is undefined", () => {
    const result = render(<Avatar />);
    const image = result.container.querySelector("img");
    expect(image).toBeNull();
  });

  test("defaults alt to an empty string when no alt is provided", () => {
    const result = render(<Avatar src="https://unsplash.it/300/300" />);
    const image = result.container.querySelector("img");
    expect(image).toHaveAttribute("alt", "");
  });

  test('renders as a custom element via the "as" prop', () => {
    const result = render(<Avatar as="a" href="/link" />);
    const view = within(result.container);
    const link = view.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/link");
  });

  test("passes additional props through to the element", () => {
    const result = render(<Avatar aria-label="custom label" />);

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("merges custom className with component classes", () => {
    const result = render(<Avatar size="md" className="custom-class" />);

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-avatar-md");
    expect(el).toHaveClass("custom-class");
  });
});

describe("avatar [snapshot]", () => {
  AVATAR_SIZES.forEach((size) => {
    test(`renders correctly when size="${size}"`, () => {
      const result = render(<Avatar size={size} />);

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });
});

describe("avatar [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    AVATAR_SIZES.forEach((size) => {
      test(`wcag2aaa (${size}, ${theme})`, async () => {
        const result = render(
          <Avatar size={size} src="https://unsplash.it/300/300" />,
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
