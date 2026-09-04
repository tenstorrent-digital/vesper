"use client";

/**
 * one live preview per component in the design system
 *
 * this is the single source of truth for the component gallery (`/components`)
 * and for the wall and marquees on the home page — so a component only has to
 * be described once
 *
 * previews are rendered inert in the gallery (`pointer-events: none`), so they
 * are written for how they *look* rather than what they do
 */

import type { ReactNode } from "react";

import { Accordion } from "@tenstorrent/vesper/accordion";
import { Admonition } from "@tenstorrent/vesper/admonition";
import { Avatar } from "@tenstorrent/vesper/avatar";
import { AvatarGroup } from "@tenstorrent/vesper/avatar-group";
import { Badge } from "@tenstorrent/vesper/badge";
import { Button } from "@tenstorrent/vesper/button";
import { Checkbox } from "@tenstorrent/vesper/checkbox";
import { Chip } from "@tenstorrent/vesper/chip";
import { Choicebox } from "@tenstorrent/vesper/choicebox";
import { Code } from "@tenstorrent/vesper/code";
import { Combobox } from "@tenstorrent/vesper/combobox";
import { FormInputMessage } from "@tenstorrent/vesper/form-input-message";
import { IconButton } from "@tenstorrent/vesper/icon-button";
import {
  Bolt,
  Copy,
  Download,
  Gear,
  Globe,
  Info,
  Search,
  Sidebar,
  Tensix,
  Trash,
  Wormhole,
} from "@tenstorrent/vesper/icons";
import { MaskedInput } from "@tenstorrent/vesper/masked-input";
import { Material } from "@tenstorrent/vesper/material";
import { Menu } from "@tenstorrent/vesper/menu";
import { ProgressBar } from "@tenstorrent/vesper/progress-bar";
import { RadioGroup } from "@tenstorrent/vesper/radio-group";
import { Range } from "@tenstorrent/vesper/range";
import { Select } from "@tenstorrent/vesper/select";
import { ShowMore } from "@tenstorrent/vesper/show-more";
import { Skeleton } from "@tenstorrent/vesper/skeleton";
import { Slider } from "@tenstorrent/vesper/slider";
import { Snippet } from "@tenstorrent/vesper/snippet";
import { SplitButton } from "@tenstorrent/vesper/split-button";
import { StatusIndicator } from "@tenstorrent/vesper/status-indicator";
import { Switch } from "@tenstorrent/vesper/switch";
import { Tabs } from "@tenstorrent/vesper/tabs";
import { Tag } from "@tenstorrent/vesper/tag";
import { TextArea } from "@tenstorrent/vesper/text-area";
import { TextButton } from "@tenstorrent/vesper/text-button";
import { TextInput } from "@tenstorrent/vesper/text-input";
import { ThemeSwitcher } from "@tenstorrent/vesper/theme-switcher";
import { Toggle } from "@tenstorrent/vesper/toggle";
import { Tooltip } from "@tenstorrent/vesper/tooltip";
import { Typography } from "@tenstorrent/vesper/typography";

export const CATEGORIES = [
  "actions",
  "inputs",
  "feedback",
  "navigation",
  "content",
  "overlays",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface ShowcaseEntry {
  /** display name, eg. "Avatar Group" */
  name: string;
  /** the doc route, eg. `/components/avatar-group` */
  href: string;
  category: Category;
  /** extra words the gallery's filter should match on */
  keywords?: string;
  preview: ReactNode;
}

const noop = () => {};

export const SHOWCASE: ShowcaseEntry[] = [
  {
    name: "Accordion",
    href: "/components/accordion",
    category: "content",
    keywords: "collapse disclosure expand details",
    preview: (
      <Accordion title="What is Vesper?" style={{ width: "100%" }}>
        A React component library built on shared design tokens.
      </Accordion>
    ),
  },
  {
    name: "Admonition",
    href: "/components/admonition",
    category: "feedback",
    keywords: "callout alert note warning banner",
    preview: (
      <Admonition variant="success" size="sm">
        Everything checks out.
      </Admonition>
    ),
  },
  {
    name: "Avatar",
    href: "/components/avatar",
    category: "content",
    keywords: "user profile picture initials",
    preview: <Avatar alt="Ada Lovelace" size="lg" />,
  },
  {
    name: "Avatar Group",
    href: "/components/avatar-group",
    category: "content",
    keywords: "users stack team overflow",
    preview: (
      <AvatarGroup
        avatars={[
          { src: undefined, alt: "Ada Lovelace" },
          { src: undefined, alt: "Grace Hopper" },
          { src: undefined, alt: "Alan Turing" },
          { src: undefined, alt: "Katherine Johnson" },
        ]}
      />
    ),
  },
  {
    name: "Badge",
    href: "/components/badge",
    category: "content",
    keywords: "label status pill count",
    preview: (
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Badge variant="mint">Stable</Badge>
        <Badge variant="purple" subtle>
          Beta
        </Badge>
      </div>
    ),
  },
  {
    name: "Button",
    href: "/components/button",
    category: "actions",
    keywords: "cta submit primary action click",
    preview: (
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button size="sm">Deploy</Button>
        <Button size="sm" variant="tertiary" iconLeft={<Bolt />}>
          Boost
        </Button>
      </div>
    ),
  },
  {
    name: "Checkbox",
    href: "/components/checkbox",
    category: "inputs",
    keywords: "form tick check multi select",
    preview: (
      <div style={{ display: "grid", gap: "0.5rem" }}>
        <Checkbox text="Ship it" defaultChecked size="sm" />
        <Checkbox text="Ship it twice" indeterminate size="sm" />
      </div>
    ),
  },
  {
    name: "Chip",
    href: "/components/chip",
    category: "inputs",
    keywords: "filter tag toggle pill",
    preview: (
      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
        <Chip>Wormhole</Chip>
        <Chip variant="contrast">Blackhole</Chip>
      </div>
    ),
  },
  {
    name: "Choicebox",
    href: "/components/choicebox",
    category: "inputs",
    keywords: "card radio select option group",
    preview: (
      <Choicebox
        name="showcase-choicebox"
        defaultValue="n300"
        options={[
          { value: "n300", label: "n300", description: "2× Wormhole" },
          { value: "p150", label: "p150", description: "1× Blackhole" },
        ]}
      />
    ),
  },
  {
    name: "Code",
    href: "/components/code",
    category: "content",
    keywords: "inline monospace snippet",
    preview: <Code>npx tt-smi --reset</Code>,
  },
  {
    name: "Code Block",
    href: "/components/code-block",
    category: "content",
    keywords: "syntax highlight shiki pre",
    preview: (
      <Material
        variant="inset"
        style={{
          fontFamily: "var(--font-plex-mono)",
          fontSize: "0.75rem",
          padding: "0.75rem",
          width: "100%",
          whiteSpace: "pre",
          overflow: "hidden",
          lineHeight: 1.6,
        }}
      >
        {`const vesper = await import(\n  "@tenstorrent/vesper"\n);`}
      </Material>
    ),
  },
  {
    name: "Combobox",
    href: "/components/combobox",
    category: "inputs",
    keywords: "autocomplete typeahead search select",
    preview: (
      <Combobox
        aria-label="Architecture"
        placeholder="Search architectures…"
        options={["Grayskull", "Wormhole", "Blackhole", "Quasar"]}
      />
    ),
  },
  {
    name: "Form Input Message",
    href: "/components/form-input-message",
    category: "feedback",
    keywords: "error hint validation helper live region",
    preview: (
      <div style={{ display: "grid", gap: "0.25rem", width: "100%" }}>
        <FormInputMessage
          variant="error"
          message="That tensor is the wrong shape."
        />
        <FormInputMessage variant="success" message="Shapes match." />
      </div>
    ),
  },
  {
    name: "Icon Button",
    href: "/components/icon-button",
    category: "actions",
    keywords: "square icon only action toolbar",
    preview: (
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <IconButton aria-label="Settings" icon={<Gear />} />
        <IconButton aria-label="Copy" variant="subtle" icon={<Copy />} />
        <IconButton aria-label="Delete" variant="danger" icon={<Trash />} />
      </div>
    ),
  },
  {
    name: "Icons",
    href: "/components/icons",
    category: "content",
    keywords: "svg pictogram symbol glyph set",
    preview: (
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          color: "var(--vesper-icon-secondary)",
        }}
      >
        <Tensix width={22} height={22} />
        <Wormhole width={22} height={22} />
        <Globe width={22} height={22} />
        <Bolt width={22} height={22} />
        <Sidebar width={22} height={22} />
      </div>
    ),
  },
  {
    name: "Masked Input",
    href: "/components/masked-input",
    category: "inputs",
    keywords: "format phone pattern maskito",
    preview: (
      <MaskedInput
        aria-label="Phone number"
        placeholder="+1 (___) ___-____"
        mask={{ format: "+1 (___) ___-____", replace: /\d/ }}
      />
    ),
  },
  {
    name: "Material",
    href: "/components/material",
    category: "content",
    keywords: "surface card elevation panel",
    preview: (
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Material variant="raised" style={{ padding: "0.75rem 1rem" }}>
          <Typography variant="label-sm">Raised</Typography>
        </Material>
        <Material variant="inset" style={{ padding: "0.75rem 1rem" }}>
          <Typography variant="label-sm">Inset</Typography>
        </Material>
      </div>
    ),
  },
  {
    name: "Menu",
    href: "/components/menu",
    category: "navigation",
    keywords: "dropdown context actions popover list",
    preview: (
      <Menu
        items={[
          { text: "Duplicate", onSelect: noop },
          { text: "Rename", onSelect: noop },
          { text: "Delete", style: "danger", onSelect: noop },
        ]}
      >
        <Button size="sm" variant="tertiary">
          Actions
        </Button>
      </Menu>
    ),
  },
  {
    name: "Modal",
    href: "/components/modal",
    category: "overlays",
    keywords: "dialog popup confirm overlay",
    preview: (
      <Material
        variant="modal"
        style={{
          padding: "1rem",
          width: "100%",
          display: "grid",
          gap: "0.5rem",
        }}
      >
        <Typography variant="label-md">Delete deployment?</Typography>
        <Typography
          variant="copy-xs"
          style={{ color: "var(--vesper-text-secondary)" }}
        >
          This cannot be undone.
        </Typography>
        <div
          style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}
        >
          <Button size="xs" variant="tertiary">
            Cancel
          </Button>
          <Button size="xs" variant="danger">
            Delete
          </Button>
        </div>
      </Material>
    ),
  },
  {
    name: "Progress Bar",
    href: "/components/progress-bar",
    category: "feedback",
    keywords: "loading percent meter determinate",
    preview: (
      <div style={{ display: "grid", gap: "0.75rem", width: "100%" }}>
        <ProgressBar value={72} aria-label="Compiling" />
        <ProgressBar value={40} variant="steps" steps={8} aria-label="Steps" />
      </div>
    ),
  },
  {
    name: "Radio Group",
    href: "/components/radio-group",
    category: "inputs",
    keywords: "single select options form",
    preview: (
      <RadioGroup
        name="showcase-radio"
        defaultValue="bf16"
        orientation="horizontal"
        size="sm"
        options={[
          { value: "bf16", label: "bf16" },
          { value: "fp8", label: "fp8" },
        ]}
      />
    ),
  },
  {
    name: "Range",
    href: "/components/range",
    category: "inputs",
    keywords: "slider two thumbs min max span",
    preview: (
      <Range
        defaultValues={[25, 75]}
        thumbAriaLabels={["Minimum", "Maximum"]}
        style={{ width: "100%" }}
      />
    ),
  },
  {
    name: "Select",
    href: "/components/select",
    category: "inputs",
    keywords: "dropdown picker options form",
    preview: (
      <Select
        aria-label="Precision"
        defaultValue="bfloat16"
        options={["float32", "bfloat16", "int8"]}
      />
    ),
  },
  {
    name: "Sheet",
    href: "/components/sheet",
    category: "overlays",
    keywords: "drawer panel side slide over",
    preview: (
      <Material
        variant="floating"
        style={{
          width: "100%",
          height: "5rem",
          display: "grid",
          gridTemplateColumns: "1fr 2.25fr",
          overflow: "hidden",
        }}
      >
        <div style={{ background: "var(--vesper-background-tertiary)" }} />
        <div
          style={{
            borderLeft:
              "var(--vesper-stroke-base) solid var(--vesper-border-primary)",
            padding: "0.75rem",
          }}
        >
          <Typography variant="label-sm">Panel</Typography>
        </div>
      </Material>
    ),
  },
  {
    name: "Show More",
    href: "/components/show-more",
    category: "actions",
    keywords: "expand collapse toggle caret",
    preview: <ShowMore />,
  },
  {
    name: "Skeleton",
    href: "/components/skeleton",
    category: "feedback",
    keywords: "loading placeholder shimmer ghost",
    preview: (
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Skeleton shape="circle" size={40} />
        <div style={{ display: "grid", gap: "0.5rem", flex: 1 }}>
          <Skeleton height={10} />
          <Skeleton height={10} width="60%" />
        </div>
      </div>
    ),
  },
  {
    name: "Slider",
    href: "/components/slider",
    category: "inputs",
    keywords: "range single value drag track",
    preview: (
      <Slider
        defaultValue={64}
        thumbAriaLabel="Clock speed"
        style={{ width: "100%" }}
      />
    ),
  },
  {
    name: "Snippet",
    href: "/components/snippet",
    category: "content",
    keywords: "copy clipboard command install",
    preview: <Snippet>npm i @tenstorrent/vesper</Snippet>,
  },
  {
    name: "Split Button",
    href: "/components/split-button",
    category: "actions",
    keywords: "dropdown primary action menu combo",
    preview: (
      <SplitButton
        size="sm"
        menuItems={[
          { text: "Save as…", onSelect: noop },
          { text: "Save a copy", onSelect: noop },
        ]}
      >
        Save
      </SplitButton>
    ),
  },
  {
    name: "Status Indicator",
    href: "/components/status-indicator",
    category: "feedback",
    keywords: "state dot running queued error live",
    preview: (
      <div style={{ display: "grid", gap: "0.5rem" }}>
        <StatusIndicator state="progress" label="Compiling" animated />
        <StatusIndicator state="ready" label="Ready" />
      </div>
    ),
  },
  {
    name: "Switch",
    href: "/components/switch",
    category: "inputs",
    keywords: "toggle on off boolean setting",
    preview: (
      <div style={{ display: "grid", gap: "0.5rem" }}>
        <Switch label="Telemetry" size="sm" defaultChecked />
        <Switch label="Autotune" size="sm" />
      </div>
    ),
  },
  {
    name: "Tabs",
    href: "/components/tabs",
    category: "navigation",
    keywords: "panels sections switch segmented",
    preview: (
      <Tabs
        defaultValue="host"
        items={[
          { value: "host", label: "Host", content: "" },
          { value: "device", label: "Device", content: "" },
          { value: "trace", label: "Trace", content: "" },
        ]}
      />
    ),
  },
  {
    name: "Tag",
    href: "/components/tag",
    category: "content",
    keywords: "label category metadata chip",
    preview: (
      <div style={{ display: "flex", gap: "0.375rem" }}>
        <Tag variant="accent-subtle">kernel</Tag>
        <Tag variant="success-subtle">passing</Tag>
      </div>
    ),
  },
  {
    name: "Text Area",
    href: "/components/text-area",
    category: "inputs",
    keywords: "multiline textarea form long text",
    preview: (
      <TextArea
        aria-label="Notes"
        placeholder="Describe the regression…"
        height={72}
      />
    ),
  },
  {
    name: "Text Button",
    href: "/components/text-button",
    category: "actions",
    keywords: "link inline minimal borderless",
    preview: <TextButton>Read the changelog</TextButton>,
  },
  {
    name: "Text Input",
    href: "/components/text-input",
    category: "inputs",
    keywords: "field form string entry",
    preview: (
      <TextInput
        aria-label="Search"
        placeholder="Search the fleet…"
        iconLeft={<Search />}
      />
    ),
  },
  {
    name: "Theme Switcher",
    href: "/components/theme-switcher",
    category: "actions",
    keywords: "dark light system colour mode",
    preview: <ThemeSwitcher size="lg" />,
  },
  {
    name: "Toast",
    href: "/components/toast",
    category: "feedback",
    keywords: "notification snackbar alert temporary",
    preview: (
      <Material
        variant="floating"
        style={{
          padding: "0.75rem 1rem",
          display: "flex",
          gap: "0.625rem",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Download width={16} height={16} />
        <Typography variant="copy-xs">Export finished — 3.2 GB</Typography>
      </Material>
    ),
  },
  {
    name: "Toggle",
    href: "/components/toggle",
    category: "inputs",
    keywords: "segmented control group single select",
    preview: (
      <Toggle
        size="sm"
        defaultValue="grid"
        options={[
          { text: "Grid", value: "grid" },
          { text: "List", value: "list" },
        ]}
      />
    ),
  },
  {
    name: "Tooltip",
    href: "/components/tooltip",
    category: "overlays",
    keywords: "hint popover hover label",
    preview: (
      <Tooltip content="Runs on all attached devices" defaultOpen={false}>
        <Button size="sm" variant="subtle" iconLeft={<Info />}>
          Hover me
        </Button>
      </Tooltip>
    ),
  },
  {
    name: "Typography",
    href: "/components/typography",
    category: "content",
    keywords: "text heading copy label type scale",
    preview: (
      <div style={{ display: "grid", gap: "0.125rem", textAlign: "center" }}>
        <Typography variant="heading-lg">Aa</Typography>
        <Typography
          variant="label-xs-mono"
          style={{ color: "var(--vesper-text-tertiary)" }}
        >
          32 variants
        </Typography>
      </div>
    ),
  },
];
