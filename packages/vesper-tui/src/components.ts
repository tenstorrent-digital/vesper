import { createElement, type ReactNode } from "react";

interface StackProps {
  children?: ReactNode;
  gap?: number;
}

type RowProps = StackProps;

interface PanelProps {
  children?: ReactNode;
  title?: string;
}

interface DividerProps {
  character?: string;
}

interface KeyHintProps {
  description: string;
  keyName: string;
}

/** Arranges terminal content vertically. */
export function Stack({ children, gap = 0 }: StackProps) {
  return createElement(
    "vesper-tui-stack",
    { "data-tui-gap": gap },
    children,
  );
}

/** Arranges terminal content horizontally. */
export function Row({ children, gap = 1 }: RowProps) {
  return createElement("vesper-tui-row", { "data-tui-gap": gap }, children);
}

/** Draws a terminal border around related content. */
export function Panel({ children, title }: PanelProps) {
  return createElement(
    "vesper-tui-panel",
    { "data-tui-title": title },
    children,
  );
}

/** Draws a horizontal terminal divider. */
export function Divider({ character = "─" }: DividerProps) {
  return createElement("vesper-tui-divider", {
    "data-tui-character": character,
  });
}

/** Displays a keyboard shortcut and its description. */
export function KeyHint({ description, keyName }: KeyHintProps) {
  return createElement("vesper-tui-key-hint", {
    "data-tui-description": description,
    "data-tui-key": keyName,
  });
}
