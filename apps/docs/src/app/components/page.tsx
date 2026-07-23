"use client";

import { Accordion } from "@repo/vesper/accordion";
import { Admonition } from "@repo/vesper/admonition";
import { Avatar } from "@repo/vesper/avatar";
import { AvatarGroup } from "@repo/vesper/avatar-group";
import { Badge } from "@repo/vesper/badge";
import { Button } from "@repo/vesper/button";
import { Checkbox } from "@repo/vesper/checkbox";
import { Chip } from "@repo/vesper/chip";
import { Code } from "@repo/vesper/code";
import { CodeBlock } from "@repo/vesper/code-block";
import { IconButton } from "@repo/vesper/icon-button";
import { ProgressBar } from "@repo/vesper/progress-bar";
import { RadioGroup } from "@repo/vesper/radio-group";
import { Select } from "@repo/vesper/select";
import { ShowMore } from "@repo/vesper/show-more";
import { Skeleton } from "@repo/vesper/skeleton";
import { Slider } from "@repo/vesper/slider";
import { Snippet } from "@repo/vesper/snippet";
import { SplitButton } from "@repo/vesper/split-button";
import { StatusIndicator } from "@repo/vesper/status-indicator";
import { Switch } from "@repo/vesper/switch";
import { Tabs } from "@repo/vesper/tabs";
import { Tag } from "@repo/vesper/tag";
import { TextButton } from "@repo/vesper/text-button";
import { TextInput } from "@repo/vesper/text-input";
import { ThemeSwitcher } from "@repo/vesper/theme-switcher";
import { Toggle } from "@repo/vesper/toggle";
import { Tooltip } from "@repo/vesper/tooltip";
import { Typography } from "@repo/vesper/typography";

const Cell = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="component-grid-cell">
      <div className="component-grid-cell-preview">{children}</div>
      <Typography variant="copy-sm" className="component-grid-cell-name">
        {name}
      </Typography>
    </div>
  );
};

export default function ComponentsPage() {
  return (
    <div className="component-grid">
      <div className="component-grid-header">
        <Typography variant="heading-lg" as="h1">
          Components
        </Typography>
        <Typography variant="copy-md" className="component-grid-subtitle">
          All available components in the Vesper design system.
        </Typography>
      </div>

      <div className="component-grid-items">
        <Cell name="Accordion">
          <Accordion title="Expand me">Hidden content</Accordion>
        </Cell>

        <Cell name="Admonition">
          <Admonition variant="info" size="sm">
            Informational note
          </Admonition>
        </Cell>

        <Cell name="Avatar">
          <Avatar alt="Jane Doe" size="md" />
        </Cell>

        <Cell name="AvatarGroup">
          <AvatarGroup
            avatars={[
              { src: undefined, alt: "Alice" },
              { src: undefined, alt: "Bob" },
              { src: undefined, alt: "Carol" },
            ]}
          />
        </Cell>

        <Cell name="Badge">
          <Badge variant="info">New</Badge>
        </Cell>

        <Cell name="Button">
          <Button size="md">Click me</Button>
        </Cell>

        <Cell name="Checkbox">
          <Checkbox label="Check me" size="md" />
        </Cell>

        <Cell name="Chip">
          <Chip>Label</Chip>
        </Cell>

        <Cell name="Code">
          <Code>console.log(&quot;hi&quot;)</Code>
        </Cell>

        <Cell name="CodeBlock">
          <CodeBlock>{"const x = 42;"}</CodeBlock>
        </Cell>

        <Cell name="IconButton">
          <IconButton aria-label="Action" icon={<span>✦</span>} />
        </Cell>

        <Cell name="ProgressBar">
          <ProgressBar value={65} className="w-full" />
        </Cell>

        <Cell name="RadioGroup">
          <RadioGroup
            name="demo-radio"
            options={[
              { label: "Option A", value: "a" },
              { label: "Option B", value: "b" },
            ]}
            defaultValue="a"
            size="sm"
          />
        </Cell>

        <Cell name="Select">
          <Select
            placeholder="Choose…"
            options={[
              { label: "Apple", value: "apple" },
              { label: "Banana", value: "banana" },
            ]}
            size="md"
          />
        </Cell>

        <Cell name="ShowMore">
          <ShowMore />
        </Cell>

        <Cell name="Skeleton">
          <Skeleton shape="pill" className="h-6 w-24" />
        </Cell>

        <Cell name="Slider">
          <Slider defaultValue={50} className="w-full" />
        </Cell>

        <Cell name="Snippet">
          <Snippet>yarn add @repo/vesper</Snippet>
        </Cell>

        <Cell name="SplitButton">
          <SplitButton menuItems={[{ text: "Save as…", onSelect: () => {} }]}>
            Save
          </SplitButton>
        </Cell>

        <Cell name="StatusIndicator">
          <StatusIndicator state="ready" label="Ready" />
        </Cell>

        <Cell name="Switch">
          <Switch label="Toggle" size="md" />
        </Cell>

        <Cell name="Tabs">
          <Tabs
            defaultValue="one"
            items={[
              { value: "one", label: "Tab 1", content: "" },
              { value: "two", label: "Tab 2", content: "" },
            ]}
          />
        </Cell>

        <Cell name="Tag">
          <Tag>Category</Tag>
        </Cell>

        <Cell name="TextButton">
          <TextButton>Learn more</TextButton>
        </Cell>

        <Cell name="TextInput">
          <TextInput placeholder="Type here…" size="md" />
        </Cell>

        <Cell name="ThemeSwitcher">
          <ThemeSwitcher size="sm" />
        </Cell>

        <Cell name="Toggle">
          <Toggle
            defaultValue="on"
            options={[
              { text: "On", value: "on" },
              { text: "Off", value: "off" },
            ]}
            size="sm"
          />
        </Cell>

        <Cell name="Tooltip">
          <Tooltip content="Helpful tip">
            <Button size="sm" variant="subtle">
              Hover me
            </Button>
          </Tooltip>
        </Cell>

        <Cell name="Typography">
          <Typography variant="heading-sm">Aa</Typography>
        </Cell>
      </div>
    </div>
  );
}
