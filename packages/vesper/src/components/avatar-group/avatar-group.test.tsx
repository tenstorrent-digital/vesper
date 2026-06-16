import { render, within, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { AVATAR_SIZES } from "@/components/avatar/avatar";
import { AvatarGroup } from "@/components/avatar-group/avatar-group";

import "@/styles/test.css";

afterEach(cleanup);

describe("avatar-group [unit]", () => {
  AVATAR_SIZES.forEach((size) => {
    test(`applies the correct size prop to each avatar when size is set to "${size}"`, () => {
      const result = render(
        <AvatarGroup
          size={size}
          avatars={[
            { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
            { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
            { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
          ]}
        />,
      );

      const avatars = result.container.querySelectorAll(".vesper-avatar");
      avatars.forEach((el) => {
        expect(el).toHaveClass(`vesper-avatar-${size}`);
      });
    });
  });

  test("does not render an overflow placeholder when there are 3 or fewer avatars", () => {
    const result = render(
      <AvatarGroup
        avatars={[
          { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
          { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
        ]}
      />,
    );
    const el = result.container.querySelector(".vesper-avatar-group-overflow");
    expect(el).toBeNull();
  });

  test("renders an overflow placeholder when there are more than 3 avatars", () => {
    const result = render(
      <AvatarGroup
        avatars={[
          { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
          { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
          { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
          { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
          { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
        ]}
      />,
    );
    const el = result.container.querySelector(".vesper-avatar-group-overflow");
    expect(el).not.toBeNull();
    expect(el).toHaveTextContent("+2");
  });

  test('shows "99+" in the overflow placeholder when there are more than 100 avatars', () => {
    const result = render(
      <AvatarGroup
        avatars={Array.from<{ src: string }>({ length: 101 }).fill({
          src: "https://unsplash.it/200/200",
        })}
      />,
    );
    const el = result.container.querySelector(".vesper-avatar-group-overflow");
    expect(el).not.toBeNull();
    expect(el).toHaveTextContent("99+");
  });

  test('renders as a custom element via the "as" prop', () => {
    const result = render(
      <AvatarGroup
        as="a"
        href="/link"
        avatars={[
          { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
        ]}
      />,
    );
    const view = within(result.container);
    const link = view.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/link");
  });

  test("passes additional props through to the element", () => {
    const result = render(
      <AvatarGroup
        aria-label="custom label"
        avatars={[
          { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
        ]}
      />,
    );

    expect(result.container.firstChild).toHaveAttribute(
      "aria-label",
      "custom label",
    );
  });

  test("merges custom className with component classes", () => {
    const result = render(
      <AvatarGroup
        className="custom-class"
        avatars={[
          { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
        ]}
      />,
    );

    const el = result.container.firstChild;
    expect(el).toHaveClass("vesper-avatar-group");
    expect(el).toHaveClass("custom-class");
  });
});

describe("avatar-group [snapshot]", () => {
  AVATAR_SIZES.forEach((size) => {
    test(`renders correctly when size="${size}"`, () => {
      const result = render(
        <AvatarGroup
          size={size}
          avatars={[
            { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
            { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
            { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
            { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
            { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
          ]}
        />,
      );

      expect(result.container.firstChild).toMatchSnapshot();
    });
  });

  test(`renders correctly when there are 3 or fewer avatars`, () => {
    const result = render(
      <AvatarGroup
        avatars={[
          { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
          { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
        ]}
      />,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });

  test(`renders correctly when there are more than 100 avatars`, () => {
    const result = render(
      <AvatarGroup
        avatars={Array.from<{ src: string }>({ length: 101 }).fill({
          src: "https://unsplash.it/200/200",
        })}
      />,
    );

    expect(result.container.firstChild).toMatchSnapshot();
  });
});

describe("avatar-group [a11y]", () => {
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
          <AvatarGroup
            size={size}
            avatars={[
              { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
              { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
              { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
              { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
              { src: "https://unsplash.it/200/200", alt: "avatar alt text" },
            ]}
          />,
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
