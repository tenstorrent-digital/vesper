import { createContext, type ReactNode } from "react";
import createReconciler, { type ReactContext } from "react-reconciler";
import {
  DefaultEventPriority,
  LegacyRoot,
  NoEventPriority,
} from "react-reconciler/constants.js";

import {
  appendNode,
  type ElementNode,
  type HostProps,
  insertNode,
  removeNode,
  type RootNode,
  type TerminalNode,
  type TextNode,
} from "./nodes.js";

let currentUpdatePriority = NoEventPriority;

const reconciler = createReconciler<
  string,
  HostProps,
  RootNode,
  ElementNode,
  TextNode,
  ElementNode,
  never,
  ElementNode,
  TerminalNode,
  null,
  never,
  ReturnType<typeof setTimeout>,
  -1,
  null
>({
  getRootHostContext: () => null,
  getChildHostContext: () => null,
  getPublicInstance: (instance) => instance,
  prepareForCommit: () => null,
  resetAfterCommit: (container) => container.onCommit(),
  preparePortalMount: () => undefined,
  createInstance: (type, props) => ({
    kind: "element",
    type,
    props,
    children: [],
    hidden: false,
    parent: null,
  }),
  appendInitialChild: appendNode,
  finalizeInitialChildren: () => false,
  shouldSetTextContent: () => false,
  createTextInstance: (text) => ({
    kind: "text",
    text,
    hidden: false,
    parent: null,
  }),
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  isPrimaryRenderer: true,
  warnsIfNotActing: false,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  supportsMicrotasks: true,
  scheduleMicrotask: queueMicrotask,
  appendChild: appendNode,
  appendChildToContainer: appendNode,
  insertBefore: insertNode,
  insertInContainerBefore: insertNode,
  removeChild: removeNode,
  removeChildFromContainer: removeNode,
  clearContainer(container) {
    for (const child of container.children) child.parent = null;
    container.children = [];
  },
  commitUpdate(instance, _type, _previousProps, nextProps) {
    instance.props = nextProps;
  },
  commitTextUpdate(instance, _previousText, nextText) {
    instance.text = nextText;
  },
  resetTextContent(instance) {
    instance.children = [];
  },
  hideInstance(instance) {
    instance.hidden = true;
  },
  hideTextInstance(instance) {
    instance.hidden = true;
  },
  unhideInstance(instance) {
    instance.hidden = false;
  },
  unhideTextInstance(instance, text) {
    instance.hidden = false;
    instance.text = text;
  },
  getInstanceFromNode: () => null,
  beforeActiveInstanceBlur: () => undefined,
  afterActiveInstanceBlur: () => undefined,
  prepareScopeUpdate: () => undefined,
  getInstanceFromScope: () => null,
  detachDeletedInstance: () => undefined,
  setCurrentUpdatePriority(priority) {
    currentUpdatePriority = priority;
  },
  getCurrentUpdatePriority: () => currentUpdatePriority,
  resolveUpdatePriority: () =>
    currentUpdatePriority || DefaultEventPriority,
  resetFormInstance: () => undefined,
  requestPostPaintCallback: (callback) => callback(Date.now()),
  shouldAttemptEagerTransition: () => false,
  trackSchedulerEvent: () => undefined,
  resolveEventType: () => null,
  resolveEventTimeStamp: () => Date.now(),
  maySuspendCommit: () => false,
  preloadInstance: () => true,
  startSuspendingCommit: () => undefined,
  suspendInstance: () => undefined,
  waitForCommitToBeReady: () => null,
  NotPendingTransition: null,
  HostTransitionContext: createContext(null) as unknown as ReactContext<null>,
});

export interface RenderRoot {
  container: RootNode;
  render(node: ReactNode): void;
  flush<T>(callback: () => T): T;
  unmount(): void;
}

export function createRenderRoot(
  onCommit: () => void,
  onError: (error: unknown) => void,
): RenderRoot {
  const container: RootNode = {
    kind: "root",
    children: [],
    onCommit,
    onError,
  };

  let uncaughtError: unknown;
  const root = reconciler.createContainer(
    container,
    LegacyRoot,
    null,
    false,
    null,
    "vesper-tui",
    (error) => {
      uncaughtError ??= error;
      onError(error);
    },
    (error) => onError(error),
    (error) => onError(error),
    () => undefined,
  );

  const throwIfNeeded = () => {
    if (uncaughtError === undefined) return;
    const error = uncaughtError;
    uncaughtError = undefined;
    throw error;
  };

  return {
    container,
    render(node) {
      reconciler.updateContainerSync(node, root, null, null);
      reconciler.flushSyncWork();
      reconciler.flushPassiveEffects();
      throwIfNeeded();
    },
    flush(callback) {
      const result = reconciler.flushSync(callback);
      reconciler.flushSyncWork();
      reconciler.flushPassiveEffects();
      throwIfNeeded();
      return result;
    },
    unmount() {
      reconciler.updateContainerSync(null, root, null, null);
      reconciler.flushSyncWork();
      reconciler.flushPassiveEffects();
    },
  };
}

export function findFocusableNodes(root: RootNode): ElementNode[] {
  const focusable: ElementNode[] = [];

  const visit = (node: TerminalNode) => {
    if (node.hidden || node.kind === "text") return;
    const disabled =
      node.props.disabled === true || node.props["aria-disabled"] === true;
    const tabIndex = node.props.tabIndex;
    const isControl =
      node.type === "button" ||
      node.type === "input" ||
      node.type === "textarea" ||
      node.type === "select" ||
      (node.type === "a" && typeof node.props.href === "string");

    if (!disabled && tabIndex !== -1 && (isControl || typeof tabIndex === "number")) {
      focusable.push(node);
    }

    for (const child of node.children) visit(child);
  };

  for (const child of root.children) visit(child);
  return focusable;
}
