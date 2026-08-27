import { describe, expect, test } from "vitest";

import {
  classifyFormInputProp,
  splitFormInputProps,
} from "@/utils/splitFormInputProps";

describe("classifyFormInputProp", () => {
  test.each(["checked", "defaultChecked", "disabled", "name", "required"])(
    "'%s' is routed to the form target",
    (prop) => {
      expect(classifyFormInputProp(prop)).toBe("form");
    },
  );

  test.each([
    "id",
    "placeholder",
    "readOnly",
    "tabIndex",
    "onChange",
    "title",
    "ref",
  ])("'%s' is routed to the control", (prop) => {
    expect(classifyFormInputProp(prop)).toBe("control");
  });

  test.each(["onScroll", "onWheel"])(
    "'%s' is routed to the control, since the control is what scrolls",
    (prop) => {
      expect(classifyFormInputProp(prop)).toBe("control");
    },
  );

  test.each(["className", "style", "onMouseEnter", "onClick"])(
    "'%s' is routed to the wrapper",
    (prop) => {
      expect(classifyFormInputProp(prop)).toBe("wrapper");
    },
  );

  test.each([
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "aria-invalid",
    "aria-errormessage",
    "aria-required",
    "aria-controls",
    "aria-expanded",
  ])("'%s' is routed to the control", (prop) => {
    expect(classifyFormInputProp(prop)).toBe("control");
  });

  test.each([
    "aria-live",
    "aria-atomic",
    "aria-busy",
    "aria-relevant",
    "aria-setsize",
    "aria-posinset",
  ])("region-scoped '%s' is routed to the wrapper", (prop) => {
    expect(classifyFormInputProp(prop)).toBe("wrapper");
  });

  test.each(["role", "aria-hidden", "children", "dangerouslySetInnerHTML"])(
    "'%s' is denied, because no destination is correct",
    (prop) => {
      expect(classifyFormInputProp(prop)).toBeNull();
    },
  );

  test("data attributes are routed to the wrapper", () => {
    expect(classifyFormInputProp("data-testid")).toBe("wrapper");
    expect(classifyFormInputProp("data-1p-ignore")).toBe("wrapper");
  });

  test("unknown props fall back to the wrapper", () => {
    expect(classifyFormInputProp("lang")).toBe("wrapper");
    expect(classifyFormInputProp("somethingInvented")).toBe("wrapper");
  });

  describe("capture handlers", () => {
    test.each([
      ["onChange", "onChangeCapture"],
      ["onKeyDown", "onKeyDownCapture"],
      ["onFocus", "onFocusCapture"],
      ["onClick", "onClickCapture"],
      ["onMouseEnter", "onMouseEnterCapture"],
    ])("'%s' and '%s' resolve to the same target", (base, capture) => {
      expect(classifyFormInputProp(capture)).toBe(classifyFormInputProp(base));
    });

    test("a non-handler ending in 'Capture' is not treated as a capture variant", () => {
      expect(classifyFormInputProp("pointerCapture")).toBe("wrapper");
    });
  });

  describe("reserved", () => {
    test("reserved props are dropped", () => {
      expect(
        classifyFormInputProp("aria-expanded", { reserved: ["aria-expanded"] }),
      ).toBeNull();
    });

    test("props not in the reserved list are unaffected", () => {
      expect(
        classifyFormInputProp("aria-label", { reserved: ["aria-expanded"] }),
      ).toBe("control");
    });
  });

  describe("overrides", () => {
    test("an override wins over the default bucket", () => {
      expect(
        classifyFormInputProp("disabled", {
          overrides: { disabled: "control" },
        }),
      ).toBe("control");
    });

    test("an override wins over the denied list", () => {
      expect(
        classifyFormInputProp("role", {
          overrides: { role: "control" },
        }),
      ).toBe("control");
    });

    test("an override wins over the reserved list", () => {
      expect(
        classifyFormInputProp("aria-expanded", {
          reserved: ["aria-expanded"],
          overrides: { "aria-expanded": "control" },
        }),
      ).toBe("control");
    });
  });
});

describe("splitFormInputProps", () => {
  test("partitions props into form, control, and wrapper buckets", () => {
    const onChange = () => {};
    const onClick = () => {};

    const result = splitFormInputProps({
      name: "field",
      required: true,
      id: "field-id",
      onChange,
      className: "custom",
      onClick,
      "data-testid": "field",
      "aria-label": "Field",
      "aria-errormessage": "err",
    });

    expect(result.formProps).toEqual({ name: "field", required: true });
    expect(result.controlProps).toEqual({
      id: "field-id",
      onChange,
      "aria-label": "Field",
      "aria-errormessage": "err",
    });
    expect(result.wrapperProps).toEqual({
      className: "custom",
      onClick,
      "data-testid": "field",
    });
  });

  test("preserves undefined values so they can override defaults", () => {
    const result = splitFormInputProps({ id: undefined });

    expect(result.controlProps).toHaveProperty("id", undefined);
  });

  test("drops reserved props entirely", () => {
    const result = splitFormInputProps(
      { "aria-expanded": "true", "aria-label": "Field" },
      { reserved: ["aria-expanded"] },
    );

    expect(result.controlProps).toEqual({ "aria-label": "Field" });
    expect(result.wrapperProps).toEqual({});
    expect(result.formProps).toEqual({});
  });

  test("returns empty buckets for empty props", () => {
    expect(splitFormInputProps({})).toEqual({
      formProps: {},
      controlProps: {},
      wrapperProps: {},
    });
  });
});
