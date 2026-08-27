/**
 * How a form input's label is associated with its control.
 *
 * - `htmlFor` — a `<label for>` pointing at the control's `id`. Only valid for labelable elements
 *   (`input`, `select`, `textarea`, `button`, `meter`, `output`, `progress`).
 * - `aria-labelledby` — the control references the label element's `id`. Required for grouping
 *   elements such as `fieldset` and `role="radiogroup"`, which `<label for>` cannot target.
 */
export type FormControlLabelAssociation = "htmlFor" | "aria-labelledby";

export interface GetFormControlPropsOptions {
  /** The `id` applied to the control element */
  controlId: string;
  /** The `id` applied to the message element */
  messageId: string;
  /** The `id` applied to the label element, when associating via `aria-labelledby` */
  labelId?: string;
  /** The label text, when one is displayed */
  label?: string;
  /** The message text, when one is displayed */
  message?: string;
  /** Whether the control is required, which appends an asterisk to the label */
  required?: boolean;
  /** A consumer-supplied `aria-describedby`, merged with the message id rather than replaced */
  ariaDescribedby?: string;
  /** How the label is associated with the control. @default htmlFor */
  labelAssociation?: FormControlLabelAssociation;
}

export interface FormControlProps {
  /** The control's `aria-describedby`, merging any consumer value with the message id */
  describedBy: string | undefined;
  /** The control's `aria-labelledby`, set only when associating via `aria-labelledby` */
  labelledBy: string | undefined;
  /** The `label` prop for `FormInputWrapper` */
  labelProps: { text: string; htmlFor?: string; id?: string } | undefined;
  /** The `message` prop for `FormInputWrapper` */
  messageProps: { text: string; id: string } | undefined;
}

/**
 * Builds the shared wiring every form input needs: the merged `aria-describedby`, and the `label`
 * and `message` props for `FormInputWrapper`.
 *
 * Replaces logic that was previously copy-pasted into each form input, most notably the
 * `aria-describedby` merge, which appeared verbatim in six components.
 *
 * Id generation stays with the caller for now; moving it here is a later step, because deriving
 * ids (`${id}-message`) changes the generated values.
 *
 * @example
 * const { describedBy, labelProps, messageProps } = getFormControlProps({
 *   controlId,
 *   messageId,
 *   label,
 *   message,
 *   required,
 *   ariaDescribedby,
 * });
 */
export function getFormControlProps({
  controlId,
  messageId,
  labelId,
  label,
  message,
  required,
  ariaDescribedby,
  labelAssociation = "htmlFor",
}: GetFormControlPropsOptions): FormControlProps {
  const usesHtmlFor = labelAssociation === "htmlFor";

  // if an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy =
    [ariaDescribedby, message ? messageId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const labelProps = label
    ? {
        text: required ? `${label} *` : label,
        ...(usesHtmlFor ? { htmlFor: controlId } : { id: labelId }),
      }
    : undefined;

  return {
    describedBy,
    labelledBy: !usesHtmlFor && label ? labelId : undefined,
    labelProps,
    messageProps: message ? { text: message, id: messageId } : undefined,
  };
}
