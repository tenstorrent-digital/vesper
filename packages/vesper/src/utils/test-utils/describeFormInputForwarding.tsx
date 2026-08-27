import type { ReactElement } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

/**
 * Every ARIA attribute React's `AriaAttributes` interface accepts.
 *
 * The point of enumerating all of them is that a form input's props type accepts every one, so
 * every one has a destination — whether or not the component was written with it in mind.
 */
export const ARIA_ATTRIBUTES = [
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-braillelabel",
  "aria-brailleroledescription",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colindextext",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-description",
  "aria-details",
  "aria-disabled",
  "aria-dropeffect",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-grabbed",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowindextext",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
] as const;

/**
 * ARIA attributes whose value must be a valid token rather than an arbitrary string, so that the
 * assertions below set something the DOM will actually keep.
 */
const ARIA_TEST_VALUES: Record<string, string> = {
  "aria-atomic": "true",
  "aria-autocomplete": "list",
  "aria-busy": "true",
  "aria-checked": "true",
  "aria-current": "true",
  "aria-disabled": "true",
  "aria-expanded": "true",
  "aria-grabbed": "true",
  "aria-haspopup": "true",
  "aria-hidden": "true",
  "aria-invalid": "true",
  "aria-live": "polite",
  "aria-modal": "true",
  "aria-multiline": "true",
  "aria-multiselectable": "true",
  "aria-orientation": "horizontal",
  "aria-pressed": "true",
  "aria-readonly": "true",
  "aria-relevant": "additions",
  "aria-required": "true",
  "aria-selected": "true",
  "aria-sort": "ascending",
};

export interface FormInputForwardingConfig {
  /** Renders the component under test with the supplied props */
  render(props: Record<string, unknown>): ReactElement;
  /** Resolves the control element — the one owning ARIA, focus, and keyboard interaction */
  control(container: HTMLElement): Element;
  /** Resolves the presentational wrapper element. @default container.firstElementChild */
  wrapper?(container: HTMLElement): Element;
  /** ARIA attributes expected on the control rather than the wrapper */
  controlAria: readonly string[];
  /** Attributes owned by the underlying primitive, which should be dropped entirely */
  reserved?: readonly string[];
}

/**
 * A shared contract suite asserting that every prop a form input accepts reaches the element it is
 * documented to reach.
 *
 * Guards against the failure mode this replaces: a prop silently landing on the non-interactive
 * wrapper, where it is either ignored or invalid, with nothing to detect it.
 *
 * @example
 * describeFormInputForwarding("checkbox", {
 *   render: (props) => <Checkbox text="Label" {...props} />,
 *   control: (container) => container.querySelector("input")!,
 *   controlAria: ["aria-label", "aria-labelledby", "aria-describedby", "aria-invalid"],
 * });
 */
export function describeFormInputForwarding(
  name: string,
  config: FormInputForwardingConfig,
) {
  const {
    render: renderComponent,
    control,
    wrapper = (container: HTMLElement) => container.firstElementChild!,
    controlAria,
    reserved = [],
  } = config;

  describe(`${name} [prop forwarding]`, () => {
    afterEach(cleanup);

    const renderWith = (props: Record<string, unknown>) => {
      const { container } = render(renderComponent(props));
      return {
        container,
        control: control(container),
        wrapper: wrapper(container),
      };
    };

    const ariaOnControl = ARIA_ATTRIBUTES.filter(
      (attribute) =>
        controlAria.includes(attribute) && !reserved.includes(attribute),
    );

    const ariaOnWrapper = ARIA_ATTRIBUTES.filter(
      (attribute) =>
        !controlAria.includes(attribute) && !reserved.includes(attribute),
    );

    test.each(ariaOnControl)("%s is applied to the control", (attribute) => {
      const value = ARIA_TEST_VALUES[attribute] ?? "test-value";
      const { control, wrapper } = renderWith({ [attribute]: value });

      expect(control).toHaveAttribute(attribute, value);
      expect(wrapper).not.toHaveAttribute(attribute);
    });

    test.each(ariaOnWrapper)("%s is applied to the wrapper", (attribute) => {
      const value = ARIA_TEST_VALUES[attribute] ?? "test-value";
      const { control, wrapper } = renderWith({ [attribute]: value });

      expect(wrapper).toHaveAttribute(attribute, value);
      expect(control).not.toHaveAttribute(attribute);
    });

    if (reserved.length > 0) {
      test.each(reserved)("%s is reserved and not forwarded", (attribute) => {
        const value = ARIA_TEST_VALUES[attribute] ?? "test-value";
        const { control, wrapper } = renderWith({ [attribute]: value });

        expect(wrapper).not.toHaveAttribute(attribute, value);
        expect(control).not.toHaveAttribute(attribute, value);
      });
    }

    test("data attributes are applied to the wrapper", () => {
      const { control, wrapper } = renderWith({ "data-testid": "field" });

      expect(wrapper).toHaveAttribute("data-testid", "field");
      expect(control).not.toHaveAttribute("data-testid");
    });

    test("id is applied to the control", () => {
      const { control, wrapper } = renderWith({ id: "custom-id" });

      expect(control).toHaveAttribute("id", "custom-id");
      expect(wrapper).not.toHaveAttribute("id");
    });

    test("className is applied to the wrapper", () => {
      const { control, wrapper } = renderWith({ className: "custom-class" });

      expect(wrapper).toHaveClass("custom-class");
      expect(control).not.toHaveClass("custom-class");
    });

    /**
     * React nulls out `currentTarget` once dispatch finishes, so it has to be captured inside the
     * handler rather than read from the mock afterwards.
     */
    const trackCurrentTarget = () => {
      const seen: { currentTarget: EventTarget | null } = {
        currentTarget: null,
      };
      const handler = vi.fn((event: { currentTarget: EventTarget | null }) => {
        seen.currentTarget = event.currentTarget;
      });
      return [handler, seen] as const;
    };

    test("focus handlers are attached to the control", () => {
      const [onFocus, seen] = trackCurrentTarget();
      const { control } = renderWith({ onFocus });

      fireEvent.focus(control);

      // React's onFocus bubbles, so currentTarget is what proves where it is attached
      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(seen.currentTarget).toBe(control);
    });

    test("keyboard handlers are attached to the control", () => {
      const [onKeyDown, seen] = trackCurrentTarget();
      const { control } = renderWith({ onKeyDown });

      fireEvent.keyDown(control, { key: "a" });

      expect(onKeyDown).toHaveBeenCalledTimes(1);
      expect(seen.currentTarget).toBe(control);
    });

    test("capture handlers follow their bubble-phase counterpart", () => {
      const [onKeyDownCapture, seen] = trackCurrentTarget();
      const { control } = renderWith({ onKeyDownCapture });

      fireEvent.keyDown(control, { key: "a" });

      expect(onKeyDownCapture).toHaveBeenCalledTimes(1);
      expect(seen.currentTarget).toBe(control);
    });

    test("pointer handlers are attached to the wrapper", () => {
      const onMouseEnter = vi.fn();
      const { wrapper } = renderWith({ onMouseEnter });

      // onMouseEnter does not bubble, so it only fires if attached to this exact element
      fireEvent.mouseEnter(wrapper);

      expect(onMouseEnter).toHaveBeenCalledTimes(1);
    });
  });
}
