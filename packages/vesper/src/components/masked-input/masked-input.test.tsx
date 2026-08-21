import { createRef } from "react";
import { Maskito, MaskitoOptions } from "@maskito/core";
import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import {
  MaskedInput,
  type MaskedInputProps,
} from "@/components/masked-input/masked-input";

import "@/styles/test.css";

/** Renders a `MaskedInput` and returns the render result alongside its input element */
function renderMaskedInput(props: MaskedInputProps = {}) {
  const result = render(<MaskedInput {...props} />);

  return {
    ...result,
    input: result.container.querySelector("input")!,
  };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("masked-input [unit]", () => {
  test("renders an input", () => {
    const result = render(<MaskedInput />);
    expect(result.getByRole("textbox").tagName).toBe("INPUT");
  });

  test("applies no masking when the mask prop is omitted", async () => {
    const { input } = renderMaskedInput();

    await userEvent.fill(input, "a1!-Z");
    expect(input).toHaveValue("a1!-Z");
  });

  test("inserts literal characters automatically as each character is typed", async () => {
    const { input } = renderMaskedInput({ mask: "___-___" });

    await userEvent.type(input, "123");
    expect(input).toHaveValue("123");

    // the literal is inserted once the next masked character is typed
    await userEvent.type(input, "4");
    expect(input).toHaveValue("123-4");

    await userEvent.type(input, "56");
    expect(input).toHaveValue("123-456");
  });

  test("masks a value inserted in a single edit, eg. a paste", async () => {
    const { input } = renderMaskedInput({ mask: "___-___" });

    await userEvent.fill(input, "123456");
    expect(input).toHaveValue("123-456");
  });

  test("ignores input beyond the length of the mask", async () => {
    const { input } = renderMaskedInput({ mask: "___-___" });

    await userEvent.fill(input, "1234567890");
    expect(input).toHaveValue("123-456");
  });

  test("restricts accepted characters when replace is a RegExp", async () => {
    const { input } = renderMaskedInput({
      mask: { format: "__-__", replace: /\d/ },
    });

    await userEvent.fill(input, "12ab34");
    expect(input).toHaveValue("12-34");
  });

  test("uses a custom placeholder character when replace is a string", async () => {
    const { input } = renderMaskedInput({
      mask: { format: "xx/xx", replace: "x" },
    });

    await userEvent.fill(input, "a1b2");
    expect(input).toHaveValue("a1/b2");
  });

  test("validates each placeholder when replace is a map", async () => {
    const { input } = renderMaskedInput({
      mask: { format: "ABA BAB", replace: { A: /[a-zA-Z]/, B: /\d/ } },
    });

    await userEvent.fill(input, "a1a1b1");
    expect(input).toHaveValue("a1a 1b1");
  });

  test("accepts a full MaskitoOptions config", async () => {
    const mask: MaskitoOptions = {
      mask: [/\d/, /\d/, ":", /\d/, /\d/],
      postprocessors: [
        ({ value, selection }) => ({
          value: value.replace(/:$/, ""),
          selection,
        }),
      ],
    };
    const { input } = renderMaskedInput({ mask });

    await userEvent.fill(input, "12");
    expect(input).toHaveValue("12");

    await userEvent.fill(input, "1234");
    expect(input).toHaveValue("12:34");
  });

  test("calls onChange with the masked value", async () => {
    const onChange = vi.fn();
    const { input } = renderMaskedInput({ mask: "___-___", onChange });

    await userEvent.fill(input, "123456");

    expect(input).toHaveValue("123-456");
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.lastCall![0];
    expect(lastCall.target.value).toBe("123-456");
  });

  test("removes the trailing literal when deleting backwards past it", async () => {
    const { input } = renderMaskedInput({ mask: "___-___" });

    await userEvent.fill(input, "1234");
    expect(input).toHaveValue("123-4");

    await userEvent.keyboard("{Backspace}{Backspace}");
    expect(input).toHaveValue("12");
  });

  test("does not reformat when the mask changes by default", async () => {
    const { input, rerender } = renderMaskedInput({
      mask: { format: "___-___", replace: /\d/ },
    });

    await userEvent.fill(input, "123456");
    expect(input).toHaveValue("123-456");

    rerender(
      <MaskedInput
        mask={{ format: "__/__/__", replace: /\d/ }}
        formatOnMaskChange={false}
      />,
    );
    expect(input).toHaveValue("123-456");

    // the new mask still applies to subsequent edits
    await userEvent.fill(input, "123456");
    expect(input).toHaveValue("12/34/56");
  });

  test("does not reformat when the mask changes when formatOnMaskChange is false", async () => {
    const { input, rerender } = renderMaskedInput({
      mask: { format: "___-___", replace: /\d/ },
      formatOnMaskChange: false,
    });

    await userEvent.fill(input, "123456");
    expect(input).toHaveValue("123-456");

    rerender(
      <MaskedInput
        mask={{ format: "__/__/__", replace: /\d/ }}
        formatOnMaskChange={false}
      />,
    );
    expect(input).toHaveValue("123-456");

    // the new mask still applies to subsequent edits
    await userEvent.fill(input, "123456");
    expect(input).toHaveValue("12/34/56");
  });

  test("reformats when the mask changes when formatOnMaskChange is true", async () => {
    const { input, rerender } = renderMaskedInput({
      mask: { format: "___-___", replace: /\d/ },
      formatOnMaskChange: true,
    });

    await userEvent.fill(input, "123456");
    expect(input).toHaveValue("123-456");

    rerender(
      <MaskedInput
        mask={{ format: "__/__/__", replace: /\d/ }}
        formatOnMaskChange={true}
      />,
    );
    expect(input).toHaveValue("12/34/56");
  });

  test("does not format the initial value on mount by default", () => {
    const { input } = renderMaskedInput({
      mask: { format: "___-___", replace: /\d/ },
      defaultValue: "123456",
    });

    expect(input).toHaveValue("123456");
  });

  test("does not format the initial value on mount when formatOnMount is false", () => {
    const { input } = renderMaskedInput({
      mask: { format: "___-___", replace: /\d/ },
      defaultValue: "123456",
      formatOnMount: false,
    });

    expect(input).toHaveValue("123456");
  });

  test("formats the initial value on mount when formatOnMount is true", () => {
    const { input } = renderMaskedInput({
      mask: { format: "___-___", replace: /\d/ },
      defaultValue: "123456",
      formatOnMount: true,
    });

    expect(input).toHaveValue("123-456");
  });

  test("an object inputRef receives the input element", () => {
    const inputRef = createRef<HTMLInputElement>();
    const { input } = renderMaskedInput({ inputRef, mask: "___-___" });

    expect(inputRef.current).toBe(input);
  });

  test("a function inputRef is called with the input element", () => {
    const inputRef = vi.fn();
    const { input } = renderMaskedInput({ inputRef, mask: "___-___" });

    expect(inputRef).toHaveBeenCalledWith(input);
  });

  test("masking still applies when an inputRef is supplied", async () => {
    const inputRef = createRef<HTMLInputElement>();
    const { input } = renderMaskedInput({ inputRef, mask: "___-___" });

    await userEvent.fill(input, "123456");

    expect(input).toHaveValue("123-456");
    expect(inputRef.current).toHaveValue("123-456");
  });

  test("an object inputRef is cleared on unmount", () => {
    const inputRef = createRef<HTMLInputElement>();
    const { unmount } = renderMaskedInput({ inputRef });

    unmount();

    expect(inputRef.current).toBeNull();
  });

  test("a function inputRef is called with null on unmount", () => {
    const inputRef = vi.fn();
    const { unmount } = renderMaskedInput({ inputRef });

    unmount();

    expect(inputRef).toHaveBeenLastCalledWith(null);
  });

  test("a function inputRef's cleanup function is called when the ref is detached", () => {
    const cleanupInputRef = vi.fn();
    const inputRef = vi.fn(() => cleanupInputRef);
    const { input, unmount } = renderMaskedInput({ inputRef, mask: "___-___" });

    expect(inputRef).toHaveBeenCalledWith(input);
    expect(cleanupInputRef).not.toHaveBeenCalled();

    unmount();

    expect(cleanupInputRef).toHaveBeenCalledOnce();
    // React 19 does not call a ref with null when it returns a cleanup function
    expect(inputRef).not.toHaveBeenCalledWith(null);
  });

  test("masking still applies when a function inputRef returns a cleanup function", async () => {
    const inputRef = vi.fn(() => vi.fn());
    const { input } = renderMaskedInput({ inputRef, mask: "___-___" });

    await userEvent.fill(input, "123456");

    expect(input).toHaveValue("123-456");
  });

  test("detaches maskito from the input element on unmount", () => {
    const destroy = vi.spyOn(Maskito.prototype, "destroy");
    const { unmount } = renderMaskedInput({
      mask: "___-___",
      inputRef: vi.fn(() => vi.fn()),
    });

    expect(destroy).not.toHaveBeenCalled();

    unmount();

    expect(destroy).toHaveBeenCalled();
  });
});

describe("masked-input [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<MaskedInput />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("renders correctly with a mask", async () => {
    const { container } = render(
      <MaskedInput label="Activation code" mask="____-____-____" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("masked-input [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    test(`a11y (${theme})`, async () => {
      const { container } = render(
        <MaskedInput label="Activation code" mask="____-____-____" />,
      );
      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
