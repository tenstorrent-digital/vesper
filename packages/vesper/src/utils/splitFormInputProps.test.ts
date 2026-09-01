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
    const [ab, cd] = splitProps(source, new Set(["a", "b"]));
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
    expect(propsA).toEqual({ value: 42 });
    expect(propsB).toEqual({ message: "Hello, world!" });
  });
});

describe("splitAriaProps", () => {
  test("aria-* props get bucketed", () => {
    const source = {
      value: 42,
      "aria-label": "The meaning of life",
      "aria-invalid": true,
    };
    const [ariaProps, restProps] = splitAriaProps(source);
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
    const [controlProps, restProps] = splitControlProps(source);
    expect(restProps).toEqual({
      message: "Hello, world!",
      value: 42,
      defaultChecked: true,
      defaultValue: true,
      disabled: true,
    });
    expect(controlProps).toEqual({
      id: "identifier",
      onChange,
      onBlur,
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

  test("form props get bucketed", () => {
    const [formProps, restProps] = splitFormProps(source);
    expect(formProps).toEqual({
      name: "biography",
      multiple: true,
      minLength: 17,
    });
    expect(restProps).toEqual({
      id: "identifier",
      onChange,
      onBlur,
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

  test("form input props get bucketed", () => {
    const result = splitFormInputProps(source);

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
});
