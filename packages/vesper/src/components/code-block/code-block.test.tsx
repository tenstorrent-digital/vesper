import { cleanup, fireEvent, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { CodeBlock, setupCodeBlock } from "@/components/code-block/code-block";
import { store } from "@/components/code-block/store";

import "@/styles/test.css";

afterEach(cleanup);

describe("code-block store [unit]", () => {
  afterEach(async () => {
    await store.reset();
  });

  test("requireInitialization throws when not initialized", () => {
    expect(() => store.requireInitialization()).toThrow(
      /setupCodeBlock must be called/,
    );
  });

  test("codeToJsx throws when not initialized", () => {
    expect(() => store.codeToJsx({ code: "x", lang: "text" })).toThrow(
      /setupCodeBlock must be called/,
    );
  });

  test("codeToStream throws when not initialized", () => {
    expect(() =>
      store.codeToStream({
        code: new ReadableStream(),
        lang: "text",
      }),
    ).toThrow(/setupCodeBlock must be called/);
  });

  test("setupCodeBlock initializes the store", async () => {
    expect(store.state.initialized).toBe(false);

    await setupCodeBlock({ langs: [] });

    expect(store.state.initialized).toBe(true);
    expect(store.state.highlighter).not.toBeNull();
  });

  test("requireInitialization does not throw after setup", async () => {
    await setupCodeBlock({ langs: [] });

    expect(() => store.requireInitialization()).not.toThrow();
  });

  test("codeToJsx returns jsx after setup", async () => {
    await setupCodeBlock({ langs: [] });

    const result = store.codeToJsx({ code: "hello", lang: "text" });
    expect(result).toBeDefined();
  });

  test("reset returns store to uninitialized state", async () => {
    await setupCodeBlock({ langs: [] });
    expect(store.state.initialized).toBe(true);

    await store.reset();

    expect(store.state.initialized).toBe(false);
    expect(store.state.highlighter).toBeNull();
  });

  test("requireInitialization throws after reset", async () => {
    await setupCodeBlock({ langs: [] });
    await store.reset();

    expect(() => store.requireInitialization()).toThrow(
      /setupCodeBlock must be called/,
    );
  });

  test("setupCodeBlock propagates rejection when createHighlighterCore fails", async () => {
    const badLang = Promise.reject(new Error("bad language grammar"));

    await expect(
      setupCodeBlock({ langs: [badLang as never] }),
    ).rejects.toThrow("bad language grammar");

    expect(store.state.initialized).toBe(false);
    expect(store.state.highlighter).toBeNull();
  });
});

describe("code-block [unit]", () => {
  beforeEach(async () => {
    await setupCodeBlock({ langs: [] });
  });

  afterEach(() => {
    store.reset();
  });

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
    const stream = new ReadableStream<string>({
      start(controller) {
        controller.enqueue("streamed code");
        controller.close();
      },
    });

    const { container } = render(<CodeBlock>{stream}</CodeBlock>);
    const wrapper = container.querySelector(".vesper-code-block-pre-wrapper");
    expect(wrapper).not.toBeNull();
    // streaming path renders via ShikiStreamRenderer which produces a shiki-stream pre
    expect(container.querySelector("pre.shiki-stream")).not.toBeNull();
  });

  test("auto-scrolls pre-wrapper when stream appends content", async () => {
    let enqueue: (chunk: string) => void;
    let close: () => void;

    const stream = new ReadableStream<string>({
      start(controller) {
        enqueue = (chunk: string) => controller.enqueue(chunk);
        close = () => controller.close();
      },
    });

    const { container } = render(<CodeBlock>{stream}</CodeBlock>);
    const wrapper = container.querySelector(
      ".vesper-code-block-pre-wrapper",
    ) as HTMLElement;

    const scrollTopSpy = vi.spyOn(wrapper, "scrollTop", "set");

    // push a chunk and allow microtasks / MutationObserver to fire
    enqueue!("line 1\nline 2\nline 3\n");
    await new Promise((r) => setTimeout(r, 200));

    // observer sets scrollTop to scrollHeight on DOM mutation
    expect(scrollTopSpy).toHaveBeenCalled();

    scrollTopSpy.mockRestore();
    close!();
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
  beforeEach(async () => {
    await setupCodeBlock({ langs: [] });
  });

  afterEach(async () => {
    await store.reset();
  });

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
});

describe("code-block [a11y]", () => {
  beforeEach(async () => {
    await setupCodeBlock({ langs: [] });
  });

  afterEach(async () => {
    await store.reset();
  });

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
