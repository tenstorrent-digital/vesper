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

  test.each(["id", "placeholder", "readOnly", "role", "tabIndex", "onChange"])(
    "'%s' is routed to the control",
    (prop) => {
      expect(classifyFormInputProp(prop)).toBe("control");
    },
  );

  test.each(["className", "style", "title", "ref", "onMouseEnter", "onClick"])(
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
  ])("'%s' is routed to the control", (prop) => {
    expect(classifyFormInputProp(prop)).toBe("control");
  });

  test.each(["aria-errormessage", "aria-required", "aria-live"])(
    "'%s' is routed to the wrapper",
    (prop) => {
      expect(classifyFormInputProp(prop)).toBe("wrapper");
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

    test("an override wins over the reserved list", () => {
      expect(
        classifyFormInputProp("role", {
          reserved: ["role"],
          overrides: { role: "control" },
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
    });
    expect(result.wrapperProps).toEqual({
      className: "custom",
      onClick,
      "data-testid": "field",
      "aria-errormessage": "err",
    });
  });

  test("preserves undefined values so they can override defaults", () => {
    const result = splitFormInputProps({ id: undefined });

    expect(result.controlProps).toHaveProperty("id", undefined);
  });

  test("drops reserved props entirely", () => {
    const result = splitFormInputProps(
      { role: "combobox", "aria-label": "Field" },
      { reserved: ["role"] },
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
