import type { ComponentProps } from "react";

import { describe, expectTypeOf, test } from "vitest";

import { Button } from "@/components/button/button";
import { Material } from "@/components/material/material";
import { Typography } from "@/components/typography/typography";

// these tests are type-level assertions, verified by `yarn check-types`
describe("Polymorphic", () => {
  test("resolves a polymorphic component's props using its default element", () => {
    type TypographyProps = ComponentProps<typeof Typography>;

    expectTypeOf<TypographyProps>().toHaveProperty("variant");
    expectTypeOf<TypographyProps>().toHaveProperty("title");
    expectTypeOf<TypographyProps>().not.toHaveProperty("href");
    expectTypeOf<TypographyProps>().not.toHaveProperty("bogus");
  });

  test("accepts props of the `as` element", () => {
    <Material as="a" href="/docs" />;

    // @ts-expect-error `bogus` is not a prop of `<a>`
    <Material as="a" bogus />;
  });

  test("retains props when `as` is another polymorphic component", () => {
    <Material as={Typography} variant="raised" title="title" />;
    <Material as={Button} size="sm" type="submit" disabled />;
    <Button as={Material} state="active" />;

    // @ts-expect-error `bogus` is not a prop of `Typography`
    <Material as={Typography} bogus />;

    // @ts-expect-error `href` is not a prop of `Typography` (renders a `<p>`)
    <Material as={Typography} href="/docs" />;

    // @ts-expect-error `size` must be a valid `ButtonSize`
    <Material as={Button} size="huge" />;
  });

  test("gives the host component's props precedence over the `as` component's props", () => {
    // @ts-expect-error `variant` refers to `Material`'s variant, not `Typography`'s
    <Material as={Typography} variant="heading-lg" />;
  });
});
