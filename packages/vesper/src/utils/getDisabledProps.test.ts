import { SyntheticEvent } from "react";
import { describe, expect, test, vi } from "vitest";

import { getDisabledProps } from "@/utils/getDisabledProps";

type SuppressEventFn = (
  e: Pick<SyntheticEvent, "preventDefault" | "stopPropagation">,
) => void;

describe("getDisabledProps", () => {
  test("returns empty object when isDisabled is false", () => {
    expect(getDisabledProps("button", false)).toEqual({});
  });

  test("returns empty object for non-native element when isDisabled is false", () => {
    expect(getDisabledProps("div", false)).toEqual({});
  });

  test.each(["button", "input", "select", "textarea", "fieldset"] as const)(
    "returns { disabled: true } for native form element '%s'",
    (element) => {
      expect(getDisabledProps(element, true)).toEqual({ disabled: true });
    },
  );

  test.each(["div", "a", "span"] as const)(
    "returns aria-disabled props for non-native element '%s'",
    (element) => {
      const result = getDisabledProps(element, true);
      expect(result).toHaveProperty("aria-disabled", true);
      expect(result).toHaveProperty("tabIndex", -1);
      expect(result).toHaveProperty("onClickCapture");
      expect(result).toHaveProperty("onMouseDownCapture");
      expect(result).toHaveProperty("onPointerDownCapture");
      expect(result).toHaveProperty("onKeyDownCapture");
      expect(result).toHaveProperty("onKeyUpCapture");
      expect(result).toHaveProperty("onFocusCapture");
    },
  );

  test("does not return aria-disabled for native form elements", () => {
    const result = getDisabledProps("button", true);
    expect(result).not.toHaveProperty("aria-disabled");
  });

  test("does not return disabled for non-native elements", () => {
    const result = getDisabledProps("div", true);
    expect(result).not.toHaveProperty("disabled");
  });

  test("suppressEvent handlers call preventDefault and stopPropagation", () => {
    const result = getDisabledProps("div", true) as Record<
      string,
      SuppressEventFn
    >;

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };

    result.onClickCapture?.(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
  });

  test("all capture handlers reference the same suppressEvent function", () => {
    const result = getDisabledProps("div", true) as Record<
      string,
      SuppressEventFn
    >;
    const handlers = [
      result.onClickCapture,
      result.onMouseDownCapture,
      result.onPointerDownCapture,
      result.onKeyDownCapture,
      result.onKeyUpCapture,
      result.onFocusCapture,
    ];
    handlers.forEach((handler) => expect(handler).toBe(handlers[0]));
  });
});
