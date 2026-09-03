"use client";

import { useState } from "react";
import bash from "@shikijs/langs/bash";

import { Admonition } from "@tenstorrent/vesper/admonition";
import { AvatarGroup } from "@tenstorrent/vesper/avatar-group";
import { Badge } from "@tenstorrent/vesper/badge";
import { Button } from "@tenstorrent/vesper/button";
import { Checkbox } from "@tenstorrent/vesper/checkbox";
import { CodeBlock } from "@tenstorrent/vesper/code-block";
import { ProgressBar } from "@tenstorrent/vesper/progress-bar";
import { RadioGroup } from "@tenstorrent/vesper/radio-group";
import { ShowMore } from "@tenstorrent/vesper/show-more";
import { SplitButton } from "@tenstorrent/vesper/split-button";
import { StatusIndicator } from "@tenstorrent/vesper/status-indicator";
import { Switch } from "@tenstorrent/vesper/switch";
import { Tabs } from "@tenstorrent/vesper/tabs";
import { TextInput } from "@tenstorrent/vesper/text-input";
import { ThemeSwitcher } from "@tenstorrent/vesper/theme-switcher";
import { addToast, Toasts } from "@tenstorrent/vesper/toast";
import { Typography } from "@tenstorrent/vesper/typography";

export function Home() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2 *:w-fit">
      <Admonition variant="warning">Introducing</Admonition>
      <br />
      <Typography variant="display-lg">Vesper</Typography>
      <div className="w-1/4! py-4">
        <ProgressBar size="sm" value={56} variant="steps" steps={5} animated />
      </div>
      <SplitButton
        onClick={() => alert("Ok!")}
        menuItems={[
          { text: "is a design system,", onSelect: () => alert("wow") },
          {
            text: "but also, more importantly,",
            onSelect: () => alert("very nice"),
          },
        ]}
      >
        Vesper
      </SplitButton>
      <RadioGroup
        name="vesper"
        defaultValue="react"
        options={[
          { value: "is", label: "is" },
          { value: "a", label: "a" },
          { value: "react", label: "React component library" },
        ]}
      />
      <Tabs
        defaultValue="in"
        className="min-w-12"
        items={[
          {
            label: "currently",
            value: "currently",
            content: (
              <div className="flex h-6 w-full items-center justify-center">
                <TextInput placeholder="(Pre-release)" />
              </div>
            ),
          },
          {
            label: "in",
            value: "in",
            content: (
              <div className="flex h-6 w-full items-center justify-center">
                <Badge variant="accent" size="lg">
                  Beta!
                </Badge>
              </div>
            ),
          },
        ]}
      />
      <ThemeSwitcher />
      <br />
      <Switch label="Enough talk" defaultChecked />
      <StatusIndicator label="Ready to get started" state="ready" />
      <br />
      <CodeBlock className="w-full md:w-3/4!" lang={bash}>
        npm install @tenstorrent/vesper
      </CodeBlock>
      <br />
      <br />
      <Checkbox
        text="I need more time"
        onChange={(e) =>
          e?.target.checked
            ? addToast({ content: "That's okay!", timeout: 5000 }) &&
              setExpanded(e.target.checked)
            : setExpanded(e.target.checked)
        }
      />
      <Toasts />
      <div>
        {expanded && (
          <Button variant="contrast" as="a" href="/getting-started">
            Learn More
          </Button>
        )}
        <div className="py-2">
          <ShowMore
            expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          />
        </div>
      </div>
      <AvatarGroup
        avatars={[
          {
            src: "https://api.dicebear.com/10.x/initial-face/svg?seed=simon",
            alt: "Simon",
          },
          {
            src: "https://api.dicebear.com/10.x/initial-face/svg?seed=mackenzie",
            alt: "Mackenzie",
          },
          {
            src: "https://api.dicebear.com/10.x/initial-face/svg?seed=neesh",
            alt: "Neesh",
          },
        ]}
      />
    </div>
  );
}
