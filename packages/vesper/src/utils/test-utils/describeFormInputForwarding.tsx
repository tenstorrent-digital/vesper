import { createRef, type ReactElement } from "react";
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

/**
 * ARIA attributes that describe the field as a region, and so belong on the wrapper.
 */
export const WRAPPER_ARIA_ATTRIBUTES = [
  "aria-atomic",
  "aria-busy",
  "aria-colcount",
  "aria-colindex",
  "aria-colindextext",
  "aria-colspan",
  "aria-level",
  "aria-live",
  "aria-posinset",
  "aria-relevant",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowindextext",
  "aria-rowspan",
  "aria-setsize",
] as const;

/**
 * ARIA attributes that are dropped rather than routed, because no destination is correct.
 */
export const DENIED_ARIA_ATTRIBUTES = ["aria-hidden"] as const;

/**
 * Values used when asserting that a reserved attribute was *not* forwarded.
 *
 * These must differ from whatever the underlying primitive sets itself, otherwise the assertion
 * cannot tell a rejected consumer value apart from the primitive's own.
 */
const ARIA_RESERVED_TEST_VALUES: Record<string, string> = {
  // Base UI's combobox sets `list`
  "aria-autocomplete": "both",
};

export interface FormInputForwardingConfig {
  /** Renders the component under test with the supplied props */
  render(props: Record<string, unknown>): ReactElement;
  /** Resolves the control element — the one owning ARIA, focus, and keyboard interaction */
  control(container: HTMLElement): Element;
  /** Resolves the presentational wrapper element. @default container.firstElementChild */
  wrapper?(container: HTMLElement): Element;
  /** Attributes owned by the underlying primitive, which should be dropped entirely */
  reserved?: readonly string[];
  /**
   * Attributes the component distributes across several inner controls rather than applying to a
   * single element, eg. `aria-describedby` across each thumb of a multi-thumb slider. Asserted to
   * be absent from the wrapper, and present somewhere inside the control.
   */
  distributed?: readonly string[];
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
    reserved = [],
    distributed = [],
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

    const isRouted = (attribute: string) =>
      !reserved.includes(attribute) &&
      !distributed.includes(attribute) &&
      !DENIED_ARIA_ATTRIBUTES.includes(
        attribute as (typeof DENIED_ARIA_ATTRIBUTES)[number],
      );

    const ariaOnControl = ARIA_ATTRIBUTES.filter(
      (attribute) =>
        isRouted(attribute) &&
        !WRAPPER_ARIA_ATTRIBUTES.includes(
          attribute as (typeof WRAPPER_ARIA_ATTRIBUTES)[number],
        ),
    );

    const ariaOnWrapper = ARIA_ATTRIBUTES.filter(
      (attribute) =>
        isRouted(attribute) &&
        WRAPPER_ARIA_ATTRIBUTES.includes(
          attribute as (typeof WRAPPER_ARIA_ATTRIBUTES)[number],
        ),
    );

    const denied = [...DENIED_ARIA_ATTRIBUTES, ...reserved];

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

    if (denied.length > 0) {
      test.each(denied)(
        "%s is not forwarded to either element",
        (attribute) => {
          const value =
            ARIA_RESERVED_TEST_VALUES[attribute] ??
            ARIA_TEST_VALUES[attribute] ??
            "test-value";
          const { control, wrapper } = renderWith({ [attribute]: value });

          expect(wrapper).not.toHaveAttribute(attribute, value);
          expect(control).not.toHaveAttribute(attribute, value);
        },
      );
    }

    if (distributed.length > 0) {
      test.each(distributed)(
        "%s is distributed across the inner controls, not the wrapper",
        (attribute) => {
          const value = ARIA_TEST_VALUES[attribute] ?? "test-value";
          const { control, wrapper } = renderWith({ [attribute]: value });

          expect(wrapper).not.toHaveAttribute(attribute);
          expect(control.querySelector(`[${attribute}]`)).not.toBeNull();
        },
      );
    }

    test("role is not forwarded to either element", () => {
      const { control, wrapper } = renderWith({ role: "presentation" });

      expect(wrapper).not.toHaveAttribute("role", "presentation");
      expect(control).not.toHaveAttribute("role", "presentation");
    });

    test("title is applied to the control", () => {
      const { control, wrapper } = renderWith({ title: "Hint text" });

      expect(control).toHaveAttribute("title", "Hint text");
      expect(wrapper).not.toHaveAttribute("title");
    });

    test("ref resolves to the control", () => {
      const ref = createRef<HTMLElement>();
      const { control } = renderWith({ ref });

      expect(ref.current).toBe(control);
    });

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

    test("scroll handlers are attached to the control, which is the element that scrolls", () => {
      const onScroll = vi.fn();
      const { control } = renderWith({ onScroll });

      // onScroll does not bubble either, so the wrapper would never see it
      fireEvent.scroll(control);

      expect(onScroll).toHaveBeenCalledTimes(1);
    });

    describe("handler buckets", () => {
      // one representative per bucket, so a mis-routed rule fails here rather than in review
      const controlHandlers = [
        ["onPaste", (element: Element) => fireEvent.paste(element)],
        ["onInput", (element: Element) => fireEvent.input(element)],
        ["onWheel", (element: Element) => fireEvent.wheel(element)],
      ] as const;

      const wrapperHandlers = [
        ["onClick", (element: Element) => fireEvent.click(element)],
        [
          "onPointerEnter",
          (element: Element) => fireEvent.pointerEnter(element),
        ],
      ] as const;

      test.each(controlHandlers)(
        "%s is attached to the control",
        (prop, fire) => {
          const [handler, seen] = trackCurrentTarget();
          const { control } = renderWith({ [prop]: handler });

          fire(control);

          expect(handler).toHaveBeenCalled();
          expect(seen.currentTarget).toBe(control);
        },
      );

      test.each(wrapperHandlers)(
        "%s is attached to the wrapper",
        (prop, fire) => {
          const [handler, seen] = trackCurrentTarget();
          const { control, wrapper } = renderWith({ [prop]: handler });

          fire(control);

          expect(handler).toHaveBeenCalled();
          expect(seen.currentTarget).toBe(wrapper);
        },
      );
    });

    describe("escape hatches", () => {
      test("controlData reaches the control, which routed data-* cannot", () => {
        const { control, wrapper } = renderWith({
          "data-region": "field",
          controlData: { "data-1p-ignore": "true" },
        });

        expect(control).toHaveAttribute("data-1p-ignore", "true");
        expect(control).not.toHaveAttribute("data-region");

        expect(wrapper).toHaveAttribute("data-region", "field");
        expect(wrapper).not.toHaveAttribute("data-1p-ignore");
      });

      test("wrapperId applies to the wrapper while id applies to the control", () => {
        const { control, wrapper } = renderWith({
          id: "control-id",
          wrapperId: "wrapper-id",
        });

        expect(control).toHaveAttribute("id", "control-id");
        expect(wrapper).toHaveAttribute("id", "wrapper-id");
      });

      test("wrapperRef resolves to the wrapper while ref resolves to the control", () => {
        const controlRef = createRef<HTMLElement>();
        const wrapperRef = createRef<HTMLDivElement>();
        const { control, wrapper } = renderWith({
          ref: controlRef,
          wrapperRef,
        });

        expect(controlRef.current).toBe(control);
        expect(wrapperRef.current).toBe(wrapper);
      });
    });
  });
}
