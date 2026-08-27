import { describe, expect, test, vi } from "vitest";

import { mergeFormInputProps } from "@/utils/mergeFormInputProps";

describe("mergeFormInputProps", () => {
  test("returns the base props when there is no override", () => {
    const base = { id: "field" };

    expect(mergeFormInputProps(base)).toBe(base);
  });

  test("replaces plain props", () => {
    const merged = mergeFormInputProps(
      { id: "routed", placeholder: "routed" },
      { id: "override" },
    );

    expect(merged).toEqual({ id: "override", placeholder: "routed" });
  });

  test("adds props the base does not have", () => {
    const merged = mergeFormInputProps({}, { "data-1p-ignore": true });

    expect(merged).toEqual({ "data-1p-ignore": true });
  });

  test("concatenates className rather than replacing it", () => {
    const merged = mergeFormInputProps(
      { className: "vesper-checkbox-input" },
      { className: "custom" },
    );

    expect(merged.className).toBe("vesper-checkbox-input custom");
  });

  test("merges style key by key", () => {
    const merged = mergeFormInputProps(
      { style: { height: "1rem", resize: "none" } },
      { style: { height: "2rem" } },
    );

    expect(merged.style).toEqual({ height: "2rem", resize: "none" });
  });

  test("composes event handlers, base first", () => {
    const calls: string[] = [];
    const merged = mergeFormInputProps(
      { onChange: () => calls.push("base") },
      { onChange: () => calls.push("override") },
    );

    (merged.onChange as () => void)();

    expect(calls).toEqual(["base", "override"]);
  });

  test("uses the override handler when the base has none", () => {
    const onChange = vi.fn();
    const merged = mergeFormInputProps({}, { onChange });

    (merged.onChange as () => void)();

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("does not mutate the base props", () => {
    const base = { className: "base" };
    mergeFormInputProps(base, { className: "override" });

    expect(base).toEqual({ className: "base" });
  });
});
