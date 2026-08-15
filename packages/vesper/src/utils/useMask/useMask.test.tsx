import { type ComponentProps, type RefObject, useState } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { useMask } from "@/utils/useMask";
import type { MaskOptions } from "@/utils/useMask/types";

afterEach(cleanup);

const PHONE_MASK = {
  mask: "(___) ___-____",
  replacement: { _: /\d/ },
} satisfies MaskOptions;

/**
 * Types `text` into the focused element one character at a time.
 *
 * `Input` polls the caret position on a `setTimeout` loop and rejects any input
 * event that arrives before the poll has run again, so keystrokes have to be
 * spaced out by at least one tick to be accepted (as they would be when typed
 * by an actual user).
 */
async function simulateUserTyping(text: string) {
  for (const char of text) {
    await userEvent.keyboard(char);
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

/** Uncontrolled input wired up to `useMask` */
function MaskedInput({
  mask,
  replacement,
  ...props
}: MaskOptions & ComponentProps<"input">) {
  const ref = useMask({ mask, replacement });

  return <input type="text" ref={ref} {...props} />;
}

/** Controlled input, mirroring how a consumer wires `useMask` into `TextInput` */
function ControlledMaskedInput({ mask, replacement }: MaskOptions) {
  const ref = useMask({ mask, replacement });
  const [value, setValue] = useState("");

  return (
    <>
      <input
        type="text"
        ref={ref}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <output>{value}</output>
    </>
  );
}

/** Renders a masked input and returns it focused, ready to receive input */
async function renderMaskedInput(
  options: MaskOptions & ComponentProps<"input"> = PHONE_MASK,
) {
  const result = render(<MaskedInput {...options} />);
  const input = result.getByRole("textbox") as HTMLInputElement;

  await userEvent.click(input);

  return { ...result, input };
}

describe("useMask", () => {
  describe("formatting", () => {
    test.each([
      ["5", "(5"],
      ["55", "(55"],
      ["555", "(555"],
      ["5551", "(555) 1"],
      ["5551234", "(555) 123-4"],
      ["5551234567", "(555) 123-4567"],
    ])("formats %o as it is typed", async (typedText, formattedValue) => {
      const { input } = await renderMaskedInput();

      await simulateUserTyping(typedText);
      expect(input.value).toBe(formattedValue);
    });

    test("formats a value inserted all at once", async () => {
      const { input } = await renderMaskedInput();

      await userEvent.fill(input, "5551234567");
      expect(input.value).toBe("(555) 123-4567");
    });

    test("ignores characters that do not match the replacement pattern", async () => {
      const { input } = await renderMaskedInput();

      await simulateUserTyping("5a5b5c");
      expect(input.value).toBe("(555");
    });

    test("ignores characters typed past the end of the mask", async () => {
      const { input } = await renderMaskedInput();

      await simulateUserTyping("55512345678999");
      expect(input.value).toBe("(555) 123-4567");
    });

    test("does not display mask characters ahead of the input", async () => {
      const { input } = await renderMaskedInput();

      expect(input.value).toBe("");
      await simulateUserTyping("5");
      expect(input.value).toBe("(5");
    });

    test("supports several replacement keys", async () => {
      const { input } = await renderMaskedInput({
        mask: "aa-00",
        replacement: { a: /[a-z]/, 0: /\d/ },
      });

      await simulateUserTyping("xy12");
      expect(input.value).toBe("xy-12");
    });

    test("supports a string replacement shorthand", async () => {
      const { input } = await renderMaskedInput({
        mask: "+1 ___-____",
        replacement: "_",
      });

      await simulateUserTyping("5551234");

      expect(input.value).toBe("+1 555-1234");
    });

    test("matches any character when using a string replacement", async () => {
      const { input } = await renderMaskedInput({
        mask: "__-__",
        replacement: "_",
      });

      await simulateUserTyping("a1b2");

      expect(input.value).toBe("a1-b2");
    });
  });

  describe("editing", () => {
    test("removes the last character on backspace", async () => {
      const { input } = await renderMaskedInput();

      await simulateUserTyping("5551234567");
      await userEvent.keyboard("{Backspace}");

      expect(input.value).toBe("(555) 123-456");
    });

    test("shifts characters left when deleting in the middle", async () => {
      const { input } = await renderMaskedInput();

      await simulateUserTyping("5551234567");
      input.setSelectionRange(3, 3);
      await userEvent.keyboard("{Backspace}");

      expect(input.value).toBe("(551) 234-567");
    });

    test("shifts characters left when deleting forward", async () => {
      const { input } = await renderMaskedInput();

      await simulateUserTyping("5551234567");
      input.setSelectionRange(1, 1);
      await userEvent.keyboard("{Delete}");

      expect(input.value).toBe("(551) 234-567");
    });

    test("replaces the selected range", async () => {
      const { input } = await renderMaskedInput();

      await simulateUserTyping("5551234567");
      input.setSelectionRange(1, 4);
      await simulateUserTyping("9");

      expect(input.value).toBe("(912) 345-67");
    });

    test("deleting a mask character leaves the value unchanged", async () => {
      const { input } = await renderMaskedInput();

      await simulateUserTyping("5551234567");
      input.setSelectionRange(1, 1);
      await userEvent.keyboard("{Backspace}");

      expect(input.value).toBe("(555) 123-4567");
    });

    test("deletes the last character forward", async () => {
      const { input } = await renderMaskedInput();

      await simulateUserTyping("555");
      input.setSelectionRange(3, 3);
      await userEvent.keyboard("{Delete}");

      expect(input.value).toBe("(55");
      expect(input.selectionStart).toBe(3);
    });

    test("clears the value when the last character is deleted", async () => {
      const { input } = await renderMaskedInput();

      await simulateUserTyping("5");
      expect(input.value).toBe("(5");

      await userEvent.keyboard("{Backspace}");

      expect(input.value).toBe("");
      expect(input.selectionStart).toBe(0);
    });
  });

  describe("caret position", () => {
    test("places the caret after the inserted character", async () => {
      const { input } = await renderMaskedInput();

      await simulateUserTyping("555");

      expect(input.selectionStart).toBe(4);
    });

    test("moves the caret past mask characters", async () => {
      const { input } = await renderMaskedInput();

      await simulateUserTyping("5551");

      expect(input.selectionStart).toBe(7);
    });

    test("keeps the caret at the change position when deleting", async () => {
      const { input } = await renderMaskedInput();

      await simulateUserTyping("5551234567");
      input.setSelectionRange(3, 3);
      await userEvent.keyboard("{Backspace}");

      expect(input.selectionStart).toBe(2);
    });
  });

  describe("controlled input", () => {
    test("keeps the masked value in sync with React state", async () => {
      const { getByRole } = render(<ControlledMaskedInput {...PHONE_MASK} />);
      const input = getByRole("textbox") as HTMLInputElement;

      await userEvent.click(input);
      await simulateUserTyping("5551234567");

      expect(input.value).toBe("(555) 123-4567");
      expect(getByRole("status")).toHaveTextContent("(555) 123-4567");
    });
  });

  describe("options", () => {
    test("ignores input when no options are provided", async () => {
      function Unmasked() {
        const ref = useMask();

        return <input type="text" ref={ref} />;
      }

      const { getByRole } = render(<Unmasked />);
      const input = getByRole("textbox") as HTMLInputElement;

      await userEvent.click(input);
      await simulateUserTyping("5551234567");

      expect(input.value).toBe("");
    });

    test("applies updated options to the next input", async () => {
      const { getByRole, rerender } = render(
        <MaskedInput mask="__-__" replacement="_" />,
      );
      const input = getByRole("textbox") as HTMLInputElement;

      await userEvent.click(input);
      await simulateUserTyping("12");

      expect(input.value).toBe("12");

      rerender(<MaskedInput mask="__/__" replacement="_" />);
      await simulateUserTyping("34");

      expect(input.value).toBe("12/34");
    });

    test("warns and skips masking for unsupported input types", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      const { getByRole } = render(
        <MaskedInput {...PHONE_MASK} type="number" />,
      );
      const input = getByRole("spinbutton") as HTMLInputElement;

      await userEvent.fill(input, "5551234567");

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("The input element type does not match"),
      );
      expect(input.value).toBe("5551234567");

      warn.mockRestore();
    });
  });

  describe("initial value validation", () => {
    test("accepts a default value that matches the mask", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});

      const { getByRole } = render(
        <MaskedInput {...PHONE_MASK} defaultValue="(555) 123-4567" />,
      );

      expect((getByRole("textbox") as HTMLInputElement).value).toBe(
        "(555) 123-4567",
      );
      expect(error).not.toHaveBeenCalled();

      error.mockRestore();
    });

    test("errors when the default value is longer than the mask", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});

      render(<MaskedInput {...PHONE_MASK} defaultValue="(555) 123-4567890" />);

      expect(error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining(
            "is longer than the value specified in the `mask` property",
          ),
        }),
      );

      error.mockRestore();
    });

    test("errors when the default value does not match the mask", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});

      render(<MaskedInput {...PHONE_MASK} defaultValue="(abc) 123-4567" />);

      expect(error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("An invalid character was found"),
        }),
      );

      error.mockRestore();
    });

    test("errors when a replacement key is longer than one character", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <MaskedInput
          mask="__-__"
          replacement={{ __: /\d/ }}
          defaultValue="12-34"
        />,
      );

      expect(error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("are longer than one character"),
        }),
      );

      error.mockRestore();
    });
  });

  describe("ref", () => {
    test("returns the same ref across renders", () => {
      const refs: RefObject<HTMLInputElement | null>[] = [];

      function RefProbe() {
        const ref = useMask(PHONE_MASK);
        refs.push(ref);

        return <input type="text" ref={ref} />;
      }

      const { rerender } = render(<RefProbe />);
      rerender(<RefProbe />);

      expect(refs.length).toBeGreaterThan(1);
      expect(new Set(refs).size).toBe(1);
    });

    test("exposes the input element on `current`", () => {
      let ref: RefObject<HTMLInputElement | null> | undefined;

      function RefProbe() {
        ref = useMask(PHONE_MASK);

        return <input type="text" ref={ref} />;
      }

      const { getByRole } = render(<RefProbe />);

      expect(ref?.current).toBe(getByRole("textbox"));
    });

    test("only allows the `current` property to be assigned", () => {
      let ref: RefObject<HTMLInputElement | null> | undefined;

      function RefProbe() {
        ref = useMask(PHONE_MASK);

        return <input type="text" ref={ref} />;
      }

      render(<RefProbe />);

      expect(() => {
        (ref as unknown as Record<string, unknown>).notCurrent = null;
      }).toThrow(TypeError);
    });

    test("stops masking once the input unmounts", async () => {
      const { input, unmount } = await renderMaskedInput();

      await simulateUserTyping("555");
      expect(input.value).toBe("(555");

      unmount();

      input.value = "999";
      fireEvent.input(input);

      expect(input.value).toBe("999");
    });
  });
});
