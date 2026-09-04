import {
  createContext,
  createElement,
  type ReactNode,
  useContext,
  useLayoutEffect,
} from "react";
import { emitKeypressEvents } from "node:readline";

import { type ElementNode, type RootNode } from "./nodes.js";
import {
  createRenderRoot,
  findFocusableNodes,
  type RenderRoot,
} from "./reconciler.js";
import { renderFrame } from "./render-frame.js";

export interface Key {
  ctrl: boolean;
  meta: boolean;
  name: string;
  sequence: string;
  shift: boolean;
}

export interface InputEvent {
  preventDefault(): void;
  readonly defaultPrevented: boolean;
}

type InputHandler = (input: string, key: Key, event: InputEvent) => void;

interface TuiController {
  exit(): void;
  subscribe(handler: InputHandler): () => void;
}

const TuiContext = createContext<TuiController | null>(null);

export interface RunOptions {
  alternateScreen?: boolean;
  color?: boolean;
  input?: NodeJS.ReadStream;
  interactive?: boolean;
  output?: NodeJS.WriteStream;
  width?: number;
}

export function useTui(): Pick<TuiController, "exit"> {
  const controller = useContext(TuiContext);
  if (!controller) {
    throw new Error("useTui must be used inside an application started by run()");
  }
  return { exit: controller.exit };
}

export function useInput(handler: InputHandler): void {
  const controller = useContext(TuiContext);
  if (!controller) {
    throw new Error("useInput must be used inside an application started by run()");
  }

  useLayoutEffect(() => controller.subscribe(handler), [controller, handler]);
}

export function renderToString(
  node: ReactNode,
  options: Pick<RunOptions, "color" | "width"> = {},
): string {
  const root = createRenderRoot(() => undefined, (error) => {
    throw error;
  });
  root.render(node);
  const output = renderFrame(root.container, {
    color: options.color,
    width: options.width,
  });
  root.unmount();
  return output;
}

export function run(node: ReactNode, options: RunOptions = {}): Promise<void> {
  return new TerminalSession(options).start(node);
}

class TerminalSession {
  private readonly alternateScreen: boolean;
  private readonly color: boolean;
  private readonly controller: TuiController;
  private readonly input: NodeJS.ReadStream;
  private readonly inputHandlers = new Set<InputHandler>();
  private readonly interactive: boolean;
  private readonly output: NodeJS.WriteStream;
  private readonly renderRoot: RenderRoot;
  private readonly requestedWidth?: number;
  private activeIndex = 0;
  private closed = false;
  private resolveExit: (() => void) | undefined;
  private wasRaw = false;

  constructor(options: RunOptions) {
    this.input = options.input ?? process.stdin;
    this.output = options.output ?? process.stdout;
    this.interactive =
      options.interactive ?? Boolean(this.input.isTTY && this.output.isTTY);
    this.alternateScreen = options.alternateScreen ?? true;
    this.color = options.color ?? Boolean(this.output.isTTY);
    this.requestedWidth = options.width;
    this.controller = {
      exit: () => this.close(),
      subscribe: (handler) => {
        this.inputHandlers.add(handler);
        return () => this.inputHandlers.delete(handler);
      },
    };
    this.renderRoot = createRenderRoot(
      () => this.draw(),
      (error) => this.close(error),
    );
  }

  start(node: ReactNode): Promise<void> {
    const completion = new Promise<void>((resolve) => {
      this.resolveExit = resolve;
    });

    if (this.interactive) this.attachTerminal();

    try {
      this.renderRoot.render(
        createElement(TuiContext.Provider, { value: this.controller }, node),
      );
    } catch (error) {
      this.close(error);
      return Promise.reject(error);
    }

    if (!this.interactive) this.close();
    return completion;
  }

  private attachTerminal(): void {
    if (this.alternateScreen) this.output.write("\u001B[?1049h");
    this.output.write("\u001B[?25l");

    this.wasRaw = this.input.isRaw ?? false;
    if (typeof this.input.setRawMode === "function") {
      this.input.setRawMode(true);
    }

    emitKeypressEvents(this.input);
    this.input.resume();
    this.input.on("keypress", this.handleKeypress);
    this.output.on("resize", this.draw);
    process.once("SIGTERM", this.handleTermination);
    process.once("SIGHUP", this.handleTermination);
  }

  private readonly handleTermination = () => this.close();

  private readonly draw = () => {
    if (this.closed) return;
    const focusable = findFocusableNodes(this.renderRoot.container);
    if (focusable.length === 0) this.activeIndex = 0;
    else this.activeIndex = Math.min(this.activeIndex, focusable.length - 1);

    const frame = renderFrame(this.renderRoot.container, {
      activeNode: focusable[this.activeIndex],
      color: this.color,
      width: this.requestedWidth ?? this.output.columns ?? 80,
    });

    if (this.interactive) {
      this.output.write(`\u001B[2J\u001B[H${frame}\n`);
    } else if (frame) {
      this.output.write(`${frame}\n`);
    }
  };

  private readonly handleKeypress = (
    input: string,
    rawKey: Partial<Key>,
  ) => {
    const key: Key = {
      ctrl: rawKey.ctrl ?? false,
      meta: rawKey.meta ?? false,
      name: rawKey.name ?? input,
      sequence: rawKey.sequence ?? input,
      shift: rawKey.shift ?? false,
    };
    let prevented = false;
    const inputEvent: InputEvent = {
      preventDefault: () => {
        prevented = true;
      },
      get defaultPrevented() {
        return prevented;
      },
    };

    try {
      this.renderRoot.flush(() => {
        for (const handler of this.inputHandlers) {
          handler(input, key, inputEvent);
        }
      });
      if (inputEvent.defaultPrevented) return;

      const focusable = findFocusableNodes(this.renderRoot.container);
      const active = focusable[this.activeIndex];
      if (active && this.dispatch(active, "onKeyDown", { input, key })) return;

      if ((key.ctrl && key.name === "c") || key.name === "escape") {
        this.close();
        return;
      }

      if (!active) return;
      if (key.name === "tab") {
        this.moveFocus(key.shift ? -1 : 1);
      } else if (
        active.type !== "input" &&
        active.type !== "textarea" &&
        (key.name === "down" || key.name === "j")
      ) {
        this.moveFocus(1);
      } else if (
        active.type !== "input" &&
        active.type !== "textarea" &&
        (key.name === "up" || key.name === "k")
      ) {
        this.moveFocus(-1);
      } else if (
        (active.type === "button" || active.type === "a") &&
        (key.name === "return" || key.name === "enter" || key.name === "space")
      ) {
        this.renderRoot.flush(() => this.dispatch(active, "onClick"));
      } else if (active.type === "input" || active.type === "textarea") {
        this.editControl(active, input, key);
      } else if (key.name === "q") {
        this.close();
      }
    } catch (error) {
      this.close(error);
    }
  };

  private moveFocus(delta: number): void {
    const focusable = findFocusableNodes(this.renderRoot.container);
    if (focusable.length === 0) return;
    const previous = focusable[this.activeIndex];
    const nextIndex =
      (this.activeIndex + delta + focusable.length) % focusable.length;
    const next = focusable[nextIndex];

    this.renderRoot.flush(() => {
      if (previous) this.dispatch(previous, "onBlur");
      this.activeIndex = nextIndex;
      if (next) this.dispatch(next, "onFocus");
    });
    this.draw();
  }

  private editControl(node: ElementNode, input: string, key: Key): void {
    if (node.props.readOnly === true || node.props.disabled === true) return;
    const previousValue = String(
      node.props.value ?? node.props.defaultValue ?? "",
    );
    let nextValue = previousValue;

    if (key.name === "backspace" || key.name === "delete") {
      nextValue = previousValue.slice(0, -1);
    } else if (
      node.type === "textarea" &&
      (key.name === "return" || key.name === "enter")
    ) {
      nextValue = `${previousValue}\n`;
    } else if (
      input &&
      !key.ctrl &&
      !key.meta &&
      !["return", "enter", "tab"].includes(key.name)
    ) {
      nextValue = `${previousValue}${input}`;
    } else {
      return;
    }

    const maxLength = Number(node.props.maxLength);
    if (Number.isFinite(maxLength) && maxLength >= 0) {
      nextValue = nextValue.slice(0, maxLength);
    }

    if (node.props.value === undefined) {
      node.props = { ...node.props, value: nextValue };
    }
    this.renderRoot.flush(() => {
      this.dispatch(node, "onChange", { value: nextValue });
      this.dispatch(node, "onInput", { value: nextValue });
    });
    this.draw();
  }

  private dispatch(
    node: ElementNode,
    handlerName: string,
    detail: { input?: string; key?: Key; value?: string } = {},
  ): boolean {
    const path: ElementNode[] = [];
    let current: ElementNode | RootNode | null = node;
    while (current && current.kind === "element") {
      path.push(current);
      current = current.parent;
    }

    let stopped = false;
    let defaultPrevented = false;
    const target = {
      ...node.props,
      value: detail.value ?? node.props.value ?? node.props.defaultValue ?? "",
    };
    const event = {
      bubbles: true,
      cancelable: true,
      ctrlKey: detail.key?.ctrl ?? false,
      currentTarget: target,
      defaultPrevented: false,
      key: detail.key?.name ?? "",
      metaKey: detail.key?.meta ?? false,
      nativeEvent: detail,
      preventDefault() {
        defaultPrevented = true;
        event.defaultPrevented = true;
      },
      shiftKey: detail.key?.shift ?? false,
      stopPropagation() {
        stopped = true;
      },
      target,
    };

    const invoke = (element: ElementNode, name: string) => {
      const handler = element.props[name];
      if (typeof handler === "function") {
        event.currentTarget = {
          ...element.props,
          value:
            detail.value ??
            element.props.value ??
            element.props.defaultValue ??
            "",
        };
        (handler as (value: typeof event) => void)(event);
      }
    };

    for (const element of [...path].reverse()) {
      invoke(element, `${handlerName}Capture`);
      if (stopped) return defaultPrevented;
    }
    for (const element of path) {
      invoke(element, handlerName);
      if (stopped) break;
    }
    return defaultPrevented;
  }

  private close(error?: unknown): void {
    if (this.closed) return;
    this.closed = true;

    if (this.interactive) {
      this.input.off("keypress", this.handleKeypress);
      this.output.off("resize", this.draw);
      process.off("SIGTERM", this.handleTermination);
      process.off("SIGHUP", this.handleTermination);
      if (typeof this.input.setRawMode === "function") {
        this.input.setRawMode(this.wasRaw);
      }
      this.output.write(
        `${this.color ? "\u001B[0m" : ""}\u001B[?25h${this.alternateScreen ? "\u001B[?1049l" : ""}`,
      );
      this.input.pause();
    }

    this.renderRoot.unmount();
    if (error) {
      const message = error instanceof Error ? error.stack : String(error);
      process.stderr.write(`${message}\n`);
    }
    this.resolveExit?.();
  }
}
