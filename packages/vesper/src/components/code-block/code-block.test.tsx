import jsonLang from "@shikijs/langs/json";
import { cleanup, fireEvent, render } from "@testing-library/react";
import axe from "axe-core";
import { StrictMode } from "react";
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";

import { CodeBlock } from "@/components/code-block/code-block";
import "@/styles/test.css";

// create a stream that emits `code` in a single chunk
const createStream = (code: string) =>
  new ReadableStream<string>({
    start(controller) {
      controller.enqueue(code);
      controller.close();
    },
  });

// create a (sync) stream factory to pass as the `children` of a streaming `CodeBlock`
const createStreamFactory = (code: string) => () => createStream(code);

// create an async stream factory to pass as the `children` of a streaming `CodeBlock`
const createAsyncStreamFactory = (code: string) => async () =>
  createStream(code);

// create a new stream factory that returns a stream with custom content
const newFactory = () =>
  new ReadableStream<string>({
    start(controller) {
      controller.enqueue("new content");
      controller.close();
    },
  });

// a stream factory that throws instead of returning a stream
const throwingStreamFactory = (): ReadableStream<string> => {
  throw new Error("factory error");
};

afterEach(cleanup);

describe("code-block [unit]", () => {
  test("renders a div", () => {
    const { container } = render(<CodeBlock />);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  test("applies vesper-code-block class", () => {
    const { container } = render(<CodeBlock />);
    expect(container.firstElementChild).toHaveClass("vesper-code-block");
  });

  test("custom className is merged", () => {
    const { container } = render(<CodeBlock className="custom-class" />);
    expect(container.firstElementChild).toHaveClass("vesper-code-block");
    expect(container.firstElementChild).toHaveClass("custom-class");
  });

  test("additional prop passthrough", () => {
    const { container } = render(
      <CodeBlock data-testid="cb" aria-label="code block">
        code
      </CodeBlock>,
    );
    expect(container.firstElementChild).toHaveAttribute(
      "aria-label",
      "code block",
    );
    expect(container.firstElementChild).toHaveAttribute("data-testid", "cb");
  });

  test("contains a pre-wrapper with vesper-code-block-pre-wrapper class", () => {
    const { container } = render(<CodeBlock />);
    expect(
      container.querySelector(".vesper-code-block-pre-wrapper"),
    ).not.toBeNull();
  });

  test("showLineNumbers defaults to false", () => {
    const { container } = render(<CodeBlock />);
    const wrapper = container.querySelector(".vesper-code-block-pre-wrapper");
    expect(wrapper).toHaveAttribute("data-line-numbers", "false");
  });

  test("showLineNumbers sets data-line-numbers to true", () => {
    const { container } = render(<CodeBlock showLineNumbers />);
    const wrapper = container.querySelector(".vesper-code-block-pre-wrapper");
    expect(wrapper).toHaveAttribute("data-line-numbers", "true");
  });

  test("renders string children as code content", () => {
    const { container } = render(<CodeBlock>const x = 1;</CodeBlock>);
    const wrapper = container.querySelector(".vesper-code-block-pre-wrapper");
    expect(wrapper?.textContent).toContain("const x = 1;");
  });

  test("renders empty content when no children provided", () => {
    const { container } = render(<CodeBlock />);
    const wrapper = container.querySelector(".vesper-code-block-pre-wrapper");
    expect(wrapper).not.toBeNull();
  });

  test("renders a copy button", () => {
    const { container } = render(<CodeBlock>code</CodeBlock>);
    const button = container.querySelector("button");
    expect(button).not.toBeNull();
    expect(button).toHaveAttribute("aria-label", "Copy code");
  });

  test("copy button uses tertiary variant", () => {
    const { container } = render(<CodeBlock>code</CodeBlock>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("vesper-button-tertiary");
  });

  test("copyOnHover defaults to false", () => {
    const { container } = render(<CodeBlock>code</CodeBlock>);
    expect(container.firstElementChild).toHaveAttribute(
      "data-copy-on-hover",
      "false",
    );
  });

  test("copyOnHover sets data-copy-on-hover to true", () => {
    const { container } = render(<CodeBlock copyOnHover>code</CodeBlock>);
    expect(container.firstElementChild).toHaveAttribute(
      "data-copy-on-hover",
      "true",
    );
  });

  test("copyOnHover is applied to streaming code blocks", () => {
    const streamFactory = createStreamFactory("streamed code");

    const { container } = render(
      <CodeBlock copyOnHover>{streamFactory}</CodeBlock>,
    );
    expect(container.firstElementChild).toHaveAttribute(
      "data-copy-on-hover",
      "true",
    );
  });

  test("copy button copies rendered text content to clipboard", () => {
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    const { container } = render(<CodeBlock>hello world</CodeBlock>);
    const button = container.querySelector("button")!;
    fireEvent.click(button);

    expect(writeText).toHaveBeenCalledWith("hello world");
    writeText.mockRestore();
  });

  test("renders a shiki pre element for string children", () => {
    const { container } = render(<CodeBlock>code</CodeBlock>);
    const pre = container.querySelector("pre.shiki");
    expect(pre).not.toBeNull();
  });

  test("multi-line string children renders multiple lines", () => {
    const { container } = render(
      <CodeBlock>{"line one\nline two\nline three"}</CodeBlock>,
    );
    const lines = container.querySelectorAll(".line");
    expect(lines.length).toBeGreaterThanOrEqual(3);
  });

  test("renders ShikiStreamRenderer for ReadableStream children", () => {
    const streamFactory = createStreamFactory("streamed code");

    const { container } = render(<CodeBlock>{streamFactory}</CodeBlock>);
    const wrapper = container.querySelector(".vesper-code-block-pre-wrapper");
    expect(wrapper).not.toBeNull();
    // streaming path renders via ShikiStreamRenderer which produces a shiki-stream pre
    expect(container.querySelector("pre.shiki-stream")).not.toBeNull();
  });

  test("auto-scrolls pre-wrapper when stream appends content", async () => {
    let enqueue: (chunk: string) => void;
    let close: () => void;

    const streamFactory = () =>
      new ReadableStream<string>({
        start(controller) {
          enqueue = (chunk: string) => controller.enqueue(chunk);
          close = () => controller.close();
        },
      });

    const { container } = render(<CodeBlock>{streamFactory}</CodeBlock>);
    const wrapper = container.querySelector(".vesper-code-block-pre-wrapper");
    assert.instanceOf(wrapper, HTMLElement);

    const scrollTopSpy = vi.spyOn(wrapper, "scrollTop", "set");

    // Allow the factory to be called (deferred to microtask)
    await new Promise((r) => setTimeout(r, 0));

    // push a chunk and allow microtasks / MutationObserver to fire
    enqueue!("line 1\nline 2\nline 3\n");
    await new Promise((r) => setTimeout(r, 200));

    // observer sets scrollTop to scrollHeight on DOM mutation
    expect(scrollTopSpy).toHaveBeenCalled();

    scrollTopSpy.mockRestore();
    close!();
  });

  test("disables auto-scroll when user scrolls away from bottom", async () => {
    let enqueue: (chunk: string) => void;

    const streamFactory = () =>
      new ReadableStream<string>({
        start(controller) {
          enqueue = (chunk: string) => controller.enqueue(chunk);
        },
      });

    const { container } = render(
      // Give the CodeBlock a fixed height so it becomes scrollable
      <CodeBlock style={{ height: 100 }}>{streamFactory}</CodeBlock>,
    );

    const wrapper = container.querySelector(".vesper-code-block-pre-wrapper");
    assert.instanceOf(wrapper, HTMLElement);

    // Allow the factory to be called (deferred to microtask)
    await new Promise((r) => setTimeout(r, 0));

    // Push enough content to overflow the wrapper
    enqueue!("a\n".repeat(20));
    await new Promise((r) => setTimeout(r, 200));

    // Sanity: auto-scroll should have placed us at the bottom
    expect(wrapper.scrollTop).toBeGreaterThan(0);

    // Simulate user scrolling to the top
    wrapper.scrollTop = 0;
    await new Promise((r) => setTimeout(r, 50));

    // Push more content — auto-scroll should be disabled
    enqueue!("new line\n");
    await new Promise((r) => setTimeout(r, 200));

    // scrollTop should still be at 0 (user's scroll position preserved)
    expect(wrapper.scrollTop).toBe(0);
  });

  test("renders with LanguageRegistration[] lang", () => {
    const { container } = render(
      <CodeBlock lang={jsonLang}>{'{"key": "value"}'}</CodeBlock>,
    );
    const pre = container.querySelector("pre.shiki");
    expect(pre).not.toBeNull();
    expect(pre?.textContent).toContain('{"key": "value"}');
  });

  test("streams with LanguageRegistration[] lang", async () => {
    const streamFactory = createStreamFactory('{"key": "value"}');

    const { container } = render(
      <CodeBlock lang={jsonLang}>{streamFactory}</CodeBlock>,
    );

    await new Promise((r) => setTimeout(r, 200));

    const pre = container.querySelector("pre.shiki-stream");
    expect(pre).not.toBeNull();
    expect(pre?.textContent).toContain('{"key": "value"}');
  });

  test("renders streamed content from an async factory", async () => {
    const asyncFactory = createAsyncStreamFactory("async content");

    const { container } = render(<CodeBlock>{asyncFactory}</CodeBlock>);

    await new Promise((r) => setTimeout(r, 200));

    const pre = container.querySelector("pre.shiki-stream");
    expect(pre).not.toBeNull();
    expect(pre?.textContent).toContain("async content");
  });

  test("async factory that resolves after cleanup cancels the stream", async () => {
    let resolveStream!: (stream: ReadableStream<string>) => void;
    const asyncFactory = () =>
      new Promise<ReadableStream<string>>((resolve) => {
        resolveStream = resolve;
      });

    const { unmount } = render(<CodeBlock>{asyncFactory}</CodeBlock>);

    // Allow the factory to be called (deferred to microtask)
    await new Promise((r) => setTimeout(r, 0));

    // Unmount before the factory resolves
    unmount();

    // Now resolve the factory — the stream should be cancelled, not piped
    const stream = new ReadableStream<string>({
      start(controller) {
        controller.enqueue("stale content");
        controller.close();
      },
    });
    const cancelSpy = vi.spyOn(stream, "cancel");

    resolveStream(stream);
    await new Promise((r) => setTimeout(r, 100));

    expect(cancelSpy).toHaveBeenCalled();
    cancelSpy.mockRestore();
  });

  test("swapping stream factories clears old tokens and ignores later old chunks", async () => {
    let enqueueOld!: (chunk: string) => void;
    let oldCancelled = false;

    const oldFactory = () =>
      new ReadableStream<string>({
        start(controller) {
          enqueueOld = (chunk: string) => controller.enqueue(chunk);
          controller.enqueue("old content");
        },
        cancel() {
          oldCancelled = true;
        },
      });

    const { container, rerender } = render(<CodeBlock>{oldFactory}</CodeBlock>);
    const getText = () =>
      container.querySelector("pre.shiki-stream")?.textContent;

    await vi.waitFor(() => expect(getText()).toContain("old content"));

    rerender(<CodeBlock>{newFactory}</CodeBlock>);

    await vi.waitFor(() => expect(getText()).toContain("new content"));
    expect(getText()).not.toContain("old content");
    await vi.waitFor(() => expect(oldCancelled).toBe(true));

    // push to the old stream after the swap (throws if the stream was already cancelled)
    try {
      enqueueOld("stale content");
    } catch {}
    await new Promise((r) => setTimeout(r, 100));

    expect(getText()).toContain("new content");
    expect(getText()).not.toContain("old content");
    expect(getText()).not.toContain("stale content");
  });

  test("old async factory resolving after a factory swap cannot render stale tokens", async () => {
    let resolveOld!: (stream: ReadableStream<string>) => void;
    const oldFactory = () =>
      new Promise<ReadableStream<string>>((resolve) => {
        resolveOld = resolve;
      });

    const { container, rerender } = render(<CodeBlock>{oldFactory}</CodeBlock>);
    const getText = () =>
      container.querySelector("pre.shiki-stream")?.textContent;

    // allow the old factory to be called (deferred to microtask)
    await new Promise((r) => setTimeout(r, 0));

    rerender(<CodeBlock>{newFactory}</CodeBlock>);

    await vi.waitFor(() => expect(getText()).toContain("new content"));

    // resolve the old factory late, after the new stream has rendered
    const staleStream = new ReadableStream<string>({
      start(controller) {
        controller.enqueue("stale content");
        controller.close();
      },
    });
    const cancelSpy = vi.spyOn(staleStream, "cancel");

    resolveOld(staleStream);
    await new Promise((r) => setTimeout(r, 100));

    expect(cancelSpy).toHaveBeenCalled();
    expect(getText()).toContain("new content");
    expect(getText()).not.toContain("stale content");
    cancelSpy.mockRestore();
  });

  test("factory that throws synchronously does not crash the component", async () => {
    // Should not throw during render or effect execution
    const { container } = render(
      <CodeBlock>{throwingStreamFactory}</CodeBlock>,
    );

    await new Promise((r) => setTimeout(r, 100));

    // Component should still be in the DOM, just with no streamed content
    const pre = container.querySelector("pre.shiki-stream");
    expect(pre).not.toBeNull();
    expect(pre?.textContent).toBe("");
  });

  test("copy button copies empty string when ref has no text content", () => {
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    const { container } = render(<CodeBlock />);
    const button = container.querySelector("button")!;
    fireEvent.click(button);

    expect(writeText).toHaveBeenCalled();
    writeText.mockRestore();
  });
});

describe("code-block [snapshot]", () => {
  test("default (no props)", () => {
    const { container } = render(<CodeBlock />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with string children", () => {
    const { container } = render(<CodeBlock>const x = 1;</CodeBlock>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with showLineNumbers", () => {
    const { container } = render(
      <CodeBlock showLineNumbers>const x = 1;</CodeBlock>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with multi-line content", () => {
    const { container } = render(
      <CodeBlock>{"const a = 1;\nconst b = 2;"}</CodeBlock>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("with custom className", () => {
    const { container } = render(
      <CodeBlock className="custom-class">code</CodeBlock>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  describe("strict mode", () => {
    test("streaming code block does not throw on Strict Mode remount", async () => {
      const streamFactory = createStreamFactory("const x = 1;");

      const { container } = render(
        <StrictMode>
          <CodeBlock>{streamFactory}</CodeBlock>
        </StrictMode>,
      );

      // Allow the stream to be consumed and tokens to render
      await new Promise((r) => setTimeout(r, 200));

      const pre = container.querySelector("pre.shiki-stream");
      expect(pre).not.toBeNull();
      expect(pre?.textContent).toContain("const x = 1;");
    });

    test("stream factory is called once per effect run", async () => {
      const factory = vi.fn(
        () =>
          new ReadableStream<string>({
            start(controller) {
              controller.enqueue("hello");
              controller.close();
            },
          }),
      );

      render(
        <StrictMode>
          <CodeBlock>{factory}</CodeBlock>
        </StrictMode>,
      );

      // Allow effects to run (Strict Mode: mount → unmount → mount = 2 calls)
      await new Promise((r) => setTimeout(r, 200));

      expect(factory).toHaveBeenCalledTimes(2);
    });
  });
});

describe("code-block [a11y]", () => {
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
      const { container } = render(<CodeBlock>const x = 1;</CodeBlock>);

      expect(await axe.run(container)).toHaveNoViolations();
    });

    test(`a11y with showLineNumbers (${theme})`, async () => {
      const { container } = render(
        <CodeBlock showLineNumbers>const x = 1;</CodeBlock>,
      );

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});
