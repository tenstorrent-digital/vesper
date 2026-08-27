import { describe, expect, test } from "vitest";

import { getFormControlProps } from "@/utils/getFormControlProps";

const baseOptions = { controlId: "control-id", messageId: "message-id" };

describe("getFormControlProps", () => {
  describe("describedBy", () => {
    test("is undefined when there is no message and no consumer value", () => {
      expect(getFormControlProps(baseOptions).describedBy).toBeUndefined();
    });

    test("is the message id when a message is supplied", () => {
      const { describedBy } = getFormControlProps({
        ...baseOptions,
        message: "Something went wrong",
      });

      expect(describedBy).toBe("message-id");
    });

    test("merges a consumer value with the message id rather than replacing it", () => {
      const { describedBy } = getFormControlProps({
        ...baseOptions,
        message: "Something went wrong",
        ariaDescribedby: "external-id",
      });

      expect(describedBy).toBe("external-id message-id");
    });

    test("is the consumer value alone when there is no message", () => {
      const { describedBy } = getFormControlProps({
        ...baseOptions,
        ariaDescribedby: "external-id",
      });

      expect(describedBy).toBe("external-id");
    });
  });

  describe("messageProps", () => {
    test("is undefined when no message is supplied", () => {
      expect(getFormControlProps(baseOptions).messageProps).toBeUndefined();
    });

    test("pairs the message text with the message id", () => {
      const { messageProps } = getFormControlProps({
        ...baseOptions,
        message: "Something went wrong",
      });

      expect(messageProps).toEqual({
        text: "Something went wrong",
        id: "message-id",
      });
    });
  });

  describe("labelProps", () => {
    test("is undefined when no label is supplied", () => {
      expect(getFormControlProps(baseOptions).labelProps).toBeUndefined();
    });

    test("associates via htmlFor by default", () => {
      const { labelProps, labelledBy } = getFormControlProps({
        ...baseOptions,
        label: "Email",
      });

      expect(labelProps).toEqual({ text: "Email", htmlFor: "control-id" });
      expect(labelledBy).toBeUndefined();
    });

    test("appends an asterisk when required", () => {
      const { labelProps } = getFormControlProps({
        ...baseOptions,
        label: "Email",
        required: true,
      });

      expect(labelProps).toEqual({ text: "Email *", htmlFor: "control-id" });
    });

    test("associates via aria-labelledby when requested", () => {
      const { labelProps, labelledBy } = getFormControlProps({
        ...baseOptions,
        labelId: "label-id",
        label: "Colour",
        labelAssociation: "aria-labelledby",
      });

      expect(labelProps).toEqual({ text: "Colour", id: "label-id" });
      expect(labelledBy).toBe("label-id");
    });

    test("does not set labelledBy when there is no label to reference", () => {
      const { labelledBy } = getFormControlProps({
        ...baseOptions,
        labelId: "label-id",
        labelAssociation: "aria-labelledby",
      });

      expect(labelledBy).toBeUndefined();
    });
  });
});

describe("getFormControlProps validation wiring", () => {
  const invalidOptions = {
    ...baseOptions,
    invalid: true,
    message: "Something went wrong",
  };

  test("marks the control invalid", () => {
    expect(getFormControlProps(invalidOptions).ariaInvalid).toBe(true);
  });

  test("marks the control invalid even without a message", () => {
    const { ariaInvalid } = getFormControlProps({
      ...baseOptions,
      invalid: true,
    });

    expect(ariaInvalid).toBe(true);
  });

  test("associates the message via aria-describedby, which is universally supported", () => {
    expect(getFormControlProps(invalidOptions).describedBy).toBe("message-id");
  });

  test("leaves aria-errormessage to the consumer", () => {
    expect(getFormControlProps(invalidOptions)).not.toHaveProperty(
      "ariaErrormessage",
    );
  });

  test("still merges a consumer aria-describedby when invalid", () => {
    const { describedBy } = getFormControlProps({
      ...invalidOptions,
      ariaDescribedby: "external-id",
    });

    expect(describedBy).toBe("external-id message-id");
  });

  test("a consumer aria-invalid wins over the derived value", () => {
    const { ariaInvalid } = getFormControlProps({
      ...invalidOptions,
      ariaInvalid: "grammar",
    });

    expect(ariaInvalid).toBe("grammar");
  });

  test("a valid control is not marked invalid", () => {
    const { ariaInvalid } = getFormControlProps({
      ...baseOptions,
      message: "Helper text",
    });

    expect(ariaInvalid).toBeUndefined();
  });
});

describe("getFormControlProps accessible name", () => {
  test("falls back to the default when nothing is supplied", () => {
    const { ariaLabel } = getFormControlProps({
      ...baseOptions,
      defaultAriaLabel: "Email",
    });

    expect(ariaLabel).toBe("Email");
  });

  test("a consumer aria-label wins over the default", () => {
    const { ariaLabel } = getFormControlProps({
      ...baseOptions,
      defaultAriaLabel: "Email",
      ariaLabel: "Custom",
    });

    expect(ariaLabel).toBe("Custom");
  });

  test("a supplied aria-labelledby suppresses the default aria-label", () => {
    const { ariaLabel, labelledBy } = getFormControlProps({
      ...baseOptions,
      defaultAriaLabel: "Email",
      ariaLabelledby: "external-label",
    });

    expect(ariaLabel).toBeUndefined();
    expect(labelledBy).toBe("external-label");
  });

  test("an explicit aria-label is kept alongside aria-labelledby", () => {
    const { ariaLabel, labelledBy } = getFormControlProps({
      ...baseOptions,
      defaultAriaLabel: "Email",
      ariaLabel: "Custom",
      ariaLabelledby: "external-label",
    });

    expect(ariaLabel).toBe("Custom");
    expect(labelledBy).toBe("external-label");
  });
});
