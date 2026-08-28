import { describe, expect, test, vi } from "vitest";

import {
  splitAriaProps,
  splitControlProps,
  splitFormInputProps,
  splitFormProps,
  splitProps,
} from "./splitFormInputProps";

describe("splitProps", () => {
  test("props get bucketed according to the provided Set<string>", () => {
    const source = { a: 0, b: 0, c: 0, d: 0 };
    const [cd, ab] = splitProps(source, new Set(["a", "b"]));
    expect(ab).toEqual({ a: 0, b: 0 });
    expect(cd).toEqual({ c: 0, d: 0 });
  });

  test("disallowed props do not get bucketed", () => {
    const source = {
      message: "Hello, world!",
      value: 42,
      role: "radiogroup",
    };
    const [propsA, propsB] = splitProps(source, new Set(["role", "value"]));
    expect(propsA).not.toHaveProperty("role");
    expect(propsB).not.toHaveProperty("role");
    expect(propsA).toEqual({ message: "Hello, world!" });
    expect(propsB).toEqual({ value: 42 });
  });
});

describe("splitAriaProps", () => {
  test("aria-* props get bucketed", () => {
    const source = {
      value: 42,
      "aria-label": "The meaning of life",
      "aria-invalid": true,
    };
    const [restProps, ariaProps] = splitAriaProps(source);
    expect(ariaProps).toEqual({
      "aria-label": "The meaning of life",
      "aria-invalid": true,
    });
    expect(restProps).toEqual({ value: 42 });
  });
});

describe("splitControlProps", () => {
  const onChange = vi.fn();
  const onBlur = vi.fn();

  test("control props get bucketed", () => {
    const source = {
      message: "Hello, world!",
      value: 42,
      defaultChecked: true,
      defaultValue: true,
      disabled: true,
      id: "identifier",
      onChange,
      onBlur,
    };
    const [restProps, controlProps] = splitControlProps(source);
    expect(controlProps).toEqual({
      id: "identifier",
      onChange,
      onBlur,
    });
    expect(restProps).toEqual({
      message: "Hello, world!",
      value: 42,
      defaultChecked: true,
      defaultValue: true,
      disabled: true,
    });
  });
});

describe("splitFormProps", () => {
  const onChange = vi.fn();
  const onBlur = vi.fn();

  const source = {
    name: "biography",
    multiple: true,
    minLength: 17,
    id: "identifier",
    onChange,
    onBlur,
  };

  test("form props get bucketed when the control element is a button", () => {
    const [restProps, formProps] = splitFormProps(source, "button");
    expect(restProps).toEqual({
      multiple: true,
      minLength: 17,
      id: "identifier",
      onChange,
      onBlur,
    });
    expect(formProps).toEqual({ name: "biography" });
  });

  test("form props get bucketed when the control element is an input", () => {
    const [restProps, formProps] = splitFormProps(source, "input");
    expect(restProps).toEqual({
      id: "identifier",
      onChange,
      onBlur,
    });
    expect(formProps).toEqual({
      name: "biography",
      multiple: true,
      minLength: 17,
    });
  });

  test("form props get bucketed when the control element is a textarea", () => {
    const [restProps, formProps] = splitFormProps(source, "textarea");
    expect(restProps).toEqual({
      multiple: true,
      id: "identifier",
      onChange,
      onBlur,
    });
    expect(formProps).toEqual({
      name: "biography",
      minLength: 17,
    });
  });
});

describe("splitFormInputProps", () => {
  const onChange = vi.fn();
  const onBlur = vi.fn();

  const source = {
    name: "biography",
    multiple: true,
    minLength: 17,
    id: "identifier",
    onChange,
    onBlur,
    "aria-hidden": true,
  };

  test("form input props get bucketed when the control is a button", () => {
    const result = splitFormInputProps(source, "button");

    expect(result).toEqual({
      ariaProps: { "aria-hidden": true },
      controlProps: { id: "identifier", onBlur, onChange },
      formProps: { name: "biography" },
      wrapperProps: { multiple: true, minLength: 17 },
    });
  });

  test("form input props get bucketed when the control is an input", () => {
    const result = splitFormInputProps(source, "input");

    expect(result).toEqual({
      ariaProps: { "aria-hidden": true },
      controlProps: { id: "identifier", onBlur, onChange },
      formProps: {
        name: "biography",
        multiple: true,
        minLength: 17,
      },
      wrapperProps: {},
    });
  });

  test("form input props get bucketed when the control is a textarea", () => {
    const result = splitFormInputProps(source, "textarea");

    expect(result).toEqual({
      ariaProps: { "aria-hidden": true },
      controlProps: { id: "identifier", onBlur, onChange },
      formProps: {
        name: "biography",
        minLength: 17,
      },
      wrapperProps: { multiple: true },
    });
  });
});
