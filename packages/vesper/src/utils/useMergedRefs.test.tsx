/**
 * Adapted from tests for `@base-ui`'s internal utility `useMergedRefsN`
 *
 * @see https://github.com/mui/base-ui/blob/ccfe02679ec9ed08a518bc5444cb6d1ffb63f5e1/packages/utils/src/useMergedRefs.test.tsx
 */

import {
  cloneElement,
  createRef,
  type ReactElement,
  type Ref,
  useCallback,
  useState,
} from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { useMergedRefs } from "@/utils/useMergedRefs";

afterEach(cleanup);

/**
 * base-ui's suite wraps renders in MUI's `.not.toErrorDev()` matcher, which
 * asserts that React logged no development warnings. This is the equivalent for
 * our setup.
 */
function withoutReactWarnings<T>(fn: () => T): T {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});

  try {
    const result = fn();
    expect(error).not.toHaveBeenCalled();
    return result;
  } finally {
    error.mockRestore();
  }
}

describe("useMergedRefs", () => {
  test("returns a single ref-setter function that forks the ref to its inputs", () => {
    interface TestComponentProps {
      innerRef: Ref<HTMLDivElement | null>;
    }

    function Component(props: TestComponentProps) {
      const { innerRef } = props;
      const [ownRefCurrent, ownRef] = useState<HTMLDivElement | null>(null);

      const handleRef = useMergedRefs(innerRef, ownRef);

      return (
        <div ref={handleRef}>{ownRefCurrent ? "has a ref" : "has no ref"}</div>
      );
    }

    const outerRef = createRef<HTMLDivElement>();

    withoutReactWarnings(() => render(<Component innerRef={outerRef} />));

    expect(outerRef.current!.textContent).toBe("has a ref");
  });

  test("forks if only one of the branches requires a ref", () => {
    function Component({ ref }: { ref?: Ref<HTMLDivElement> }) {
      const [hasRef, setHasRef] = useState(false);
      const handleOwnRef = useCallback(() => setHasRef(true), []);
      const handleRef = useMergedRefs(handleOwnRef, ref);

      return (
        <div ref={handleRef} data-testid="hasRef">
          {String(hasRef)}
        </div>
      );
    }

    const { getByTestId } = withoutReactWarnings(() => render(<Component />));

    expect(getByTestId("hasRef")).toHaveTextContent("true");
  });

  test("does nothing if none of the forked branches requires a ref", () => {
    interface TestComponentProps {
      children: ReactElement<{ ref?: Ref<HTMLDivElement> }>;
      ref?: Ref<HTMLDivElement>;
    }

    function Outer({ children, ref }: TestComponentProps) {
      const handleRef = useMergedRefs(children.props.ref, ref);
      return cloneElement(children, { ref: handleRef });
    }

    function Inner() {
      return <div />;
    }

    withoutReactWarnings(() =>
      render(
        <Outer>
          <Inner />
        </Outer>,
      ),
    );
  });

  describe("changing refs", () => {
    interface TestComponentProps {
      leftRef?: Ref<HTMLDivElement | null>;
      rightRef?: Ref<HTMLDivElement | null>;
      id?: string;
    }

    function Div(props: TestComponentProps) {
      const { leftRef, rightRef, ...other } = props;
      const handleRef = useMergedRefs(leftRef, rightRef);

      return <div {...other} ref={handleRef} />;
    }

    test("handles changing from no ref to some ref", () => {
      const { rerender } = withoutReactWarnings(() =>
        render(<Div id="test" />),
      );

      const ref = createRef<HTMLDivElement>();

      withoutReactWarnings(() => rerender(<Div id="test" leftRef={ref} />));

      expect(ref.current!.id).toBe("test");
    });

    test("cleans up detached refs", () => {
      const firstLeftRef = createRef<HTMLDivElement>();
      const firstRightRef = createRef<HTMLDivElement>();
      const secondRightRef = createRef<HTMLDivElement>();

      const { rerender } = withoutReactWarnings(() =>
        render(
          <Div leftRef={firstLeftRef} rightRef={firstRightRef} id="test" />,
        ),
      );

      expect(firstLeftRef.current!.id).toBe("test");
      expect(firstRightRef.current!.id).toBe("test");
      expect(secondRightRef.current).toBe(null);

      rerender(
        <Div leftRef={firstLeftRef} rightRef={secondRightRef} id="test" />,
      );

      expect(firstLeftRef.current!.id).toBe("test");
      expect(firstRightRef.current).toBe(null);
      expect(secondRightRef.current!.id).toBe("test");
    });
  });

  test("calls clean up function if it exists", () => {
    const cleanUp = vi.fn();
    const setup = vi.fn();
    const setup2 = vi.fn();
    const nullHandler = vi.fn();

    function onRefChangeWithCleanup(ref: HTMLDivElement | null) {
      if (ref) {
        setup(ref.id);
      } else {
        nullHandler();
      }
      return cleanUp;
    }

    function onRefChangeWithoutCleanup(ref: HTMLDivElement | null) {
      if (ref) {
        setup2(ref.id);
      } else {
        nullHandler();
      }
    }

    function App() {
      const ref = useMergedRefs(
        onRefChangeWithCleanup,
        onRefChangeWithoutCleanup,
      );

      return <div id="test" ref={ref} />;
    }

    // base-ui opts out of StrictMode here; testing library does not wrap
    // renders in StrictMode by default
    const { unmount } = render(<App />);

    expect(setup.mock.calls[0]?.[0]).toBe("test");
    expect(setup.mock.calls.length).toBe(1);
    expect(cleanUp.mock.calls.length).toBe(0);

    expect(setup2.mock.calls[0]?.[0]).toBe("test");
    expect(setup2.mock.calls.length).toBe(1);

    unmount();

    expect(setup.mock.calls.length).toBe(1);
    expect(cleanUp.mock.calls.length).toBe(1);

    // Setup was not called again
    expect(setup2.mock.calls.length).toBe(1);
    // Null handler hit because no cleanup is returned
    expect(nullHandler.mock.calls.length).toBe(1);
  });
});
