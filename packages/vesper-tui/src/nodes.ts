import type { ReactNode } from "react";

export type HostProps = Record<string, unknown> & {
  children?: ReactNode;
  className?: string;
};

export interface RootNode {
  kind: "root";
  children: TerminalNode[];
  onCommit(): void;
  onError(error: unknown): void;
}

export interface ElementNode {
  kind: "element";
  type: string;
  props: HostProps;
  children: TerminalNode[];
  hidden: boolean;
  parent: ParentNode | null;
}

export interface TextNode {
  kind: "text";
  text: string;
  hidden: boolean;
  parent: ParentNode | null;
}

export type ParentNode = RootNode | ElementNode;
export type TerminalNode = ElementNode | TextNode;

export function appendNode(parent: ParentNode, child: TerminalNode): void {
  removeFromParent(child);
  parent.children.push(child);
  child.parent = parent;
}

export function insertNode(
  parent: ParentNode,
  child: TerminalNode,
  before: TerminalNode,
): void {
  removeFromParent(child);
  const index = parent.children.indexOf(before);
  parent.children.splice(index < 0 ? parent.children.length : index, 0, child);
  child.parent = parent;
}

export function removeNode(parent: ParentNode, child: TerminalNode): void {
  const index = parent.children.indexOf(child);
  if (index >= 0) parent.children.splice(index, 1);
  child.parent = null;
}

function removeFromParent(child: TerminalNode): void {
  if (child.parent) removeNode(child.parent, child);
}
