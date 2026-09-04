import type { ElementNode, RootNode, TerminalNode } from "./nodes.js";

const ANSI_PATTERN = new RegExp(
  `${String.fromCodePoint(27)}\\[[0-?]*[ -/]*[@-~]`,
  "g",
);

interface RenderContext {
  activeNode?: ElementNode;
  color: boolean;
  width: number;
}

export interface FrameOptions {
  activeNode?: ElementNode;
  color?: boolean;
  width?: number;
}

export function renderFrame(
  root: RootNode,
  { activeNode, color = false, width = 80 }: FrameOptions = {},
): string {
  const context = {
    activeNode,
    color,
    width: Math.max(20, width),
  };

  return trimBlankLines(renderNodes(root.children, context, 0)).join("\n");
}

function renderNode(
  node: TerminalNode,
  context: RenderContext,
): string[] {
  if (node.hidden) return [];
  if (node.kind === "text") return wrap(node.text, context.width);
  if (node.props["aria-hidden"] === true) return [];

  switch (node.type) {
    case "vesper-tui-stack":
      return renderNodes(
        node.children,
        context,
        toPositiveInteger(node.props["data-tui-gap"]),
      );
    case "vesper-tui-row":
      return renderRow(node, context);
    case "vesper-tui-panel":
      return renderPanel(node, context);
    case "vesper-tui-divider":
      return [
        String(node.props["data-tui-character"] ?? "─").slice(0, 1).repeat(
          context.width,
        ),
      ];
    case "vesper-tui-key-hint":
      return [
        `${style(String(node.props["data-tui-key"] ?? ""), ["cyan", "bold"], context.color)} ${String(node.props["data-tui-description"] ?? "")}`,
      ];
    case "button":
      return [renderButton(node, context)];
    case "input":
      return [renderInput(node, context)];
    case "textarea":
      return renderTextArea(node, context);
    case "hr":
      return ["─".repeat(context.width)];
    case "br":
      return [""];
    case "svg":
      return node.props["aria-label"]
        ? [String(node.props["aria-label"])]
        : [];
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return renderTextBlock(node, context, ["cyan", "bold"]);
    case "p":
      return renderTextBlock(
        node,
        context,
        typographyStyles(node.props.className),
      );
    case "pre":
      return collectText(node)
        .split("\n")
        .flatMap((line) => wrap(line, context.width))
        .map((line) => style(line, ["dim"], context.color));
    case "li": {
      const lines = renderNodes(node.children, context, 0);
      return lines.map((line, index) => `${index === 0 ? "• " : "  "}${line}`);
    }
    case "span":
    case "strong":
    case "em":
    case "small":
    case "label":
    case "code":
    case "kbd":
    case "time":
      return renderTextBlock(node, context, inlineStyles(node.type));
    default:
      return renderNodes(node.children, context, 0);
  }
}

function renderNodes(
  nodes: TerminalNode[],
  context: RenderContext,
  gap: number,
): string[] {
  const blocks = nodes
    .map((child) => renderNode(child, context))
    .filter((block) => block.length > 0);

  return blocks.flatMap((block, index) => [
    ...(index > 0 ? Array.from({ length: gap }, () => "") : []),
    ...block,
  ]);
}

function renderRow(node: ElementNode, context: RenderContext): string[] {
  const gap = " ".repeat(toPositiveInteger(node.props["data-tui-gap"], 1));
  const blocks = node.children
    .map((child) => renderNode(child, context))
    .filter((block) => block.length > 0);
  const height = Math.max(0, ...blocks.map((block) => block.length));
  const widths = blocks.map((block) =>
    Math.max(0, ...block.map((line) => visibleLength(line))),
  );

  return Array.from({ length: height }, (_, lineIndex) =>
    blocks
      .map((block, blockIndex) =>
        padVisible(block[lineIndex] ?? "", widths[blockIndex] ?? 0),
      )
      .join(gap)
      .trimEnd(),
  );
}

function renderPanel(node: ElementNode, context: RenderContext): string[] {
  const title = String(node.props["data-tui-title"] ?? "");
  const innerContext = { ...context, width: Math.max(16, context.width - 4) };
  const content = trimBlankLines(renderNodes(node.children, innerContext, 0));
  const contentWidth = Math.max(
    16,
    visibleLength(title) + 2,
    ...content.map(visibleLength),
  );
  const topLabel = title ? ` ${title} ` : "";
  const top = `┌${topLabel}${"─".repeat(
    Math.max(0, contentWidth + 2 - topLabel.length),
  )}┐`;
  const body =
    content.length > 0
      ? content.map((line) => `│ ${padVisible(line, contentWidth)} │`)
      : [`│ ${" ".repeat(contentWidth)} │`];

  return [
    style(top, ["dim"], context.color),
    ...body,
    style(`└${"─".repeat(contentWidth + 2)}┘`, ["dim"], context.color),
  ];
}

function renderButton(node: ElementNode, context: RenderContext): string {
  const label =
    normalizeInlineText(collectText(node)) ||
    String(node.props["aria-label"] ?? "Action");
  const disabled =
    node.props.disabled === true || node.props["aria-disabled"] === true;
  const focused = context.activeNode === node;
  const variant = classTokens(node).find((token) =>
    token.startsWith("vesper-button-"),
  );
  const colors: StyleName[] =
    variant === "vesper-button-danger"
      ? ["red"]
      : variant === "vesper-button-warning"
        ? ["yellow"]
        : variant === "vesper-button-primary"
          ? ["cyan"]
          : [];
  const marker = focused ? "▶" : " ";
  const rendered = `${marker} [ ${label} ]`;

  return style(
    rendered,
    disabled ? ["dim"] : focused ? [...colors, "inverse", "bold"] : colors,
    context.color,
  );
}

function renderInput(node: ElementNode, context: RenderContext): string {
  const focused = context.activeNode === node;
  const label = controlLabel(node, "Input");
  const value = String(node.props.value ?? node.props.defaultValue ?? "");
  const placeholder = String(node.props.placeholder ?? "").trim();
  const displayValue = value || style(placeholder, ["dim"], context.color);
  const cursor = focused ? style("▌", ["cyan"], context.color) : "";
  const line = `${focused ? "▶" : " "} ${label}: ${displayValue}${cursor}`;

  return style(line, focused ? ["bold"] : [], context.color);
}

function renderTextArea(node: ElementNode, context: RenderContext): string[] {
  const focused = context.activeNode === node;
  const label = controlLabel(node, "Text");
  const value = String(node.props.value ?? node.props.defaultValue ?? "");
  const placeholder = String(node.props.placeholder ?? "").trim();
  const text = value || placeholder;
  const width = Math.max(12, context.width - 4);
  const content = (text ? wrap(text, width) : [""]).slice(0, 6);
  if (focused) {
    const lastIndex = Math.max(content.length - 1, 0);
    content[lastIndex] = `${content[lastIndex] ?? ""}▌`;
  }

  return [
    style(`${focused ? "▶" : " "} ${label}`, focused ? ["bold"] : [], context.color),
    `  ┌${"─".repeat(width)}┐`,
    ...content.map((line) => `  │${padVisible(line, width)}│`),
    `  └${"─".repeat(width)}┘`,
  ];
}

function renderTextBlock(
  node: ElementNode,
  context: RenderContext,
  styles: StyleName[],
): string[] {
  return wrap(normalizeInlineText(collectText(node)), context.width).map((line) =>
    style(line, styles, context.color),
  );
}

function collectText(node: TerminalNode): string {
  if (node.hidden) return "";
  if (node.kind === "text") return node.text;
  if (node.type === "svg") return String(node.props["aria-label"] ?? "");
  return node.children.map(collectText).join("");
}

function controlLabel(node: ElementNode, fallback: string): string {
  const label =
    node.props["aria-label"] ??
    node.props.name ??
    node.props.title ??
    fallback;
  return String(label);
}

function classTokens(node: ElementNode): string[] {
  return typeof node.props.className === "string"
    ? node.props.className.split(/\s+/)
    : [];
}

type StyleName = "bold" | "cyan" | "dim" | "inverse" | "red" | "yellow";

const STYLE_CODES: Record<StyleName, number> = {
  bold: 1,
  dim: 2,
  red: 31,
  yellow: 33,
  cyan: 36,
  inverse: 7,
};

function style(text: string, styles: StyleName[], enabled: boolean): string {
  if (!enabled || !text || styles.length === 0) return text;
  return `${styles.map((name) => `\u001B[${STYLE_CODES[name]}m`).join("")}${text}\u001B[0m`;
}

function typographyStyles(className: unknown): StyleName[] {
  if (typeof className !== "string") return [];
  if (/vesper-typography-(display|heading)-/.test(className)) {
    return ["cyan", "bold"];
  }
  if (/-bold(?:\s|$)/.test(className)) return ["bold"];
  if (/-mono(?:\s|$)/.test(className)) return ["dim"];
  return [];
}

function inlineStyles(type: string): StyleName[] {
  if (type === "strong") return ["bold"];
  if (type === "code" || type === "kbd") return ["cyan"];
  if (type === "small") return ["dim"];
  return [];
}

function normalizeInlineText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function wrap(value: string, width: number): string[] {
  const normalized = value.replace(/\r/g, "");
  if (!normalized) return [""];

  return normalized.split("\n").flatMap((sourceLine) => {
    if (!sourceLine) return [""];
    const words = sourceLine.split(/\s+/);
    const lines: string[] = [];
    let line = "";

    for (const word of words) {
      if (!line) {
        line = word;
      } else if (line.length + word.length + 1 <= width) {
        line += ` ${word}`;
      } else {
        lines.push(line);
        line = word;
      }
    }

    if (line) lines.push(line);
    return lines;
  });
}

function trimBlankLines(lines: string[]): string[] {
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start] === "") start += 1;
  while (end > start && lines[end - 1] === "") end -= 1;
  return lines.slice(start, end);
}

function visibleLength(value: string): number {
  return value.replace(ANSI_PATTERN, "").length;
}

function padVisible(value: string, width: number): string {
  return `${value}${" ".repeat(Math.max(0, width - visibleLength(value)))}`;
}

function toPositiveInteger(value: unknown, fallback = 0): number {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : fallback;
}
