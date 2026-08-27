import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { getFormControlProps } from "@/utils/getFormControlProps";
import { splitFormInputProps } from "@/utils/splitFormInputProps";
import { resetWarnOnce } from "@/utils/warnOnce";

const baseOptions = { controlId: "control-id", messageId: "message-id" };

describe("development warnings", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    resetWarnOnce();
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  describe("dropped props", () => {
    test("explains why a denied prop was dropped", () => {
      splitFormInputProps({ "aria-hidden": true });

      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0]![0]).toContain("aria-hidden");
      expect(warn.mock.calls[0]![0]).toContain("hidden");
    });

    test("points role at the underlying control", () => {
      splitFormInputProps({ role: "presentation" });

      expect(warn.mock.calls[0]![0]).toContain("implicit role");
    });

    test("names the component when a reserved prop is dropped", () => {
      splitFormInputProps(
        { "aria-expanded": true },
        { name: "Select", reserved: ["aria-expanded"] },
      );

      expect(warn.mock.calls[0]![0]).toContain("Select");
      expect(warn.mock.calls[0]![0]).toContain("aria-expanded");
    });

    test("does not warn for routed props", () => {
      splitFormInputProps({ "aria-label": "Field", className: "custom" });

      expect(warn).not.toHaveBeenCalled();
    });

    test("warns only once for the same message", () => {
      splitFormInputProps({ "aria-hidden": true });
      splitFormInputProps({ "aria-hidden": true });

      expect(warn).toHaveBeenCalledTimes(1);
    });
  });

  describe("aria-errormessage pairing", () => {
    test("warns when supplied without the control being invalid", () => {
      getFormControlProps({
        ...baseOptions,
        name: "TextInput",
        ariaErrormessage: "error-id",
      });

      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0]![0]).toContain("aria-errormessage");
      expect(warn.mock.calls[0]![0]).toContain("TextInput");
    });

    test("does not warn when the variant marks the control invalid", () => {
      getFormControlProps({
        ...baseOptions,
        invalid: true,
        ariaErrormessage: "error-id",
      });

      expect(warn).not.toHaveBeenCalled();
    });

    test("does not warn when aria-invalid is supplied", () => {
      getFormControlProps({
        ...baseOptions,
        ariaInvalid: true,
        ariaErrormessage: "error-id",
      });

      expect(warn).not.toHaveBeenCalled();
    });

    test("warns when aria-invalid is explicitly false", () => {
      getFormControlProps({
        ...baseOptions,
        invalid: true,
        ariaInvalid: "false",
        ariaErrormessage: "error-id",
      });

      expect(warn).toHaveBeenCalledTimes(1);
    });
  });

  describe("competing accessible names", () => {
    test("warns when both aria-label and aria-labelledby are supplied", () => {
      getFormControlProps({
        ...baseOptions,
        name: "Checkbox",
        ariaLabel: "Label",
        ariaLabelledby: "external-label",
      });

      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0]![0]).toContain("aria-labelledby");
    });

    test("does not warn when the aria-label is the component's own default", () => {
      getFormControlProps({
        ...baseOptions,
        defaultAriaLabel: "Accept terms",
        ariaLabelledby: "external-label",
      });

      expect(warn).not.toHaveBeenCalled();
    });
  });
});
