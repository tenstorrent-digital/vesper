"use client";

import Link from "next/link";
import { type BundledLanguage, bundledLanguages } from "shiki/bundle/web";

import { Accordion } from "@tenstorrent/vesper/accordion";
import { Admonition } from "@tenstorrent/vesper/admonition";
import { Avatar } from "@tenstorrent/vesper/avatar";
import { AvatarGroup } from "@tenstorrent/vesper/avatar-group";
import { Badge } from "@tenstorrent/vesper/badge";
import { Button } from "@tenstorrent/vesper/button";
import { Checkbox } from "@tenstorrent/vesper/checkbox";
import { Chip } from "@tenstorrent/vesper/chip";
import { Code } from "@tenstorrent/vesper/code";
import { CodeBlock } from "@tenstorrent/vesper/code-block";
import { Combobox } from "@tenstorrent/vesper/combobox";
import { IconButton } from "@tenstorrent/vesper/icon-button";
import { MaskedInput } from "@tenstorrent/vesper/masked-input";
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

import {
  convertPascalToKebabCase,
  convertPascalToTitleCase,
} from "@/lib/filesystem/utils";

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
      <Typography
        as={Link}
        href={`/components/${convertPascalToKebabCase(name)}`}
        variant="copy-md-bold"
      >
        {convertPascalToTitleCase(name)}
      </Typography>
    </div>
  );
};

const cssLang = (await bundledLanguages["css" as BundledLanguage]()).default;

export default function Page() {
  return (
    <div className="no-max-width component-grid">
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
          <CodeBlock lang={cssLang}>{`.prose {
  --spacing: 1rem;
  --content-width: 72ch;
  --font-size: 1rem;
  --gap: 1rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
}`}</CodeBlock>
        </Cell>

        <Cell name="Combobox">
          <Combobox
            aria-label="Fruit"
            options={[
              { label: "Apple", value: "apple" },
              { label: "Banana", value: "banana" },
              { label: "Orange", value: "orange" },
              { label: "Pineapple", value: "pineapple" },
              { label: "Grape", value: "grape" },
            ]}
          />
        </Cell>

        <Cell name="IconButton">
          <IconButton aria-label="Action" icon={<span>✦</span>} />
        </Cell>

        <Cell name="MaskedInput">
          <MaskedInput
            placeholder="Enter your phone number"
            mask={{ format: "+1 (___) ___-____", replace: /\d/ }}
          />
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
          <Skeleton className="h-6 w-24" />
        </Cell>

        <Cell name="Slider">
          <Slider
            defaultValue={50}
            thumbAriaLabel="Volume"
            className="w-full"
          />
        </Cell>

        <Cell name="Range">
          <Range
            defaultValues={[0, 100]}
            thumbAriaLabels={["Volume (min)", "Volume (max)"]}
            className="w-full"
          />
        </Cell>

        <Cell name="Snippet">
          <Snippet>yarn add @tenstorrent/vesper</Snippet>
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

        <Cell name="TextArea">
          <TextArea placeholder="Tell us about yourself" />
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
