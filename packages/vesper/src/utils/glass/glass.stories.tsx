import type { Meta, StoryObj } from "@storybook/react-vite";

import tsx from "@shikijs/langs/tsx";
import {
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  useRef,
} from "react";

import { Accordion } from "@/components/accordion/accordion";
import { Admonition } from "@/components/admonition/admonition";
import { AvatarGroup } from "@/components/avatar-group/avatar-group";
import { Avatar } from "@/components/avatar/avatar";
import { Badge } from "@/components/badge/badge";
import { Button, BUTTON_VARIANTS } from "@/components/button/button";
import { Checkbox } from "@/components/checkbox/checkbox";
import { Chip } from "@/components/chip/chip";
import { Choicebox } from "@/components/choicebox/choicebox";
import { CodeBlock } from "@/components/code-block/code-block";
import { Code } from "@/components/code/code";
import { Combobox } from "@/components/combobox/combobox";
import { FormInputMessage } from "@/components/form-input-message/form-input-message";
import { IconButton } from "@/components/icon-button/icon-button";
import { Search, Tenstorrent } from "@/components/icons/icons";
import { Material } from "@/components/material/material";
import { Menu } from "@/components/menu/menu";
import { Modal, useModal } from "@/components/modal/modal";
import { ProgressBar } from "@/components/progress-bar/progress-bar";
import { RadioGroup } from "@/components/radio-group/radio-group";
import { Range } from "@/components/range/range";
import { Select } from "@/components/select/select";
import { Sheet, useSheet } from "@/components/sheet/sheet";
import { ShowMore } from "@/components/show-more/show-more";
import { Skeleton } from "@/components/skeleton/skeleton";
import { Slider } from "@/components/slider/slider";
import { Snippet } from "@/components/snippet/snippet";
import { SplitButton } from "@/components/split-button/split-button";
import { StatusIndicator } from "@/components/status-indicator/status-indicator";
import { Switch } from "@/components/switch/switch";
import { Tabs } from "@/components/tabs/tabs";
import { Tag } from "@/components/tag/tag";
import { TextArea } from "@/components/text-area/text-area";
import { TextButton } from "@/components/text-button/text-button";
import { TextInput } from "@/components/text-input/text-input";
import { ThemeSwitcher } from "@/components/theme-switcher/theme-switcher";
import { addToast, Toasts } from "@/components/toast/toast";
import { Toggle } from "@/components/toggle/toggle";
import { Tooltip } from "@/components/tooltip/tooltip";
import { Typography } from "@/components/typography/typography";

/**
 * Colorful, high-detail backgrounds that make glass refraction easy to
 * see (glass over a flat color is indistinguishable from a flat color)
 */
export const GLASS_BACKDROPS = ["type", "aurora", "stripes", "plain"] as const;

export type GlassBackdrop = (typeof GLASS_BACKDROPS)[number];

const AURORA = [
  "radial-gradient(circle at 15% 20%, var(--vesper-pink-300), transparent 40%)",
  "radial-gradient(circle at 85% 25%, var(--vesper-teal-400), transparent 45%)",
  "radial-gradient(circle at 70% 85%, var(--vesper-purple-400), transparent 45%)",
  "radial-gradient(circle at 20% 80%, var(--vesper-yellow-300), transparent 40%)",
  "var(--vesper-image-dot) repeat top",
  "var(--vesper-background-primary)",
].join(", ");

const STRIPES = [
  "repeating-linear-gradient(-45deg",
  "var(--vesper-purple-400) 0 1.25rem",
  "var(--vesper-yellow-300) 1.25rem 2.5rem",
  "var(--vesper-teal-400) 2.5rem 3.75rem",
  "var(--vesper-pink-300) 3.75rem 5rem)",
].join(", ");

// large letterforms behind the glass show off the bending at its edges
const TYPE_TILE = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='110'><text x='4' y='88' font-family='Inter Tight, Helvetica, sans-serif' font-size='92' font-weight='800' fill='#344b49' fill-opacity='0.6'>Aa</text></svg>",
)}") repeat`;

export const GLASS_BACKDROP_STYLES: { [B in GlassBackdrop]: string } = {
  type: `${TYPE_TILE}, ${AURORA}`,
  aurora: AURORA,
  stripes: STRIPES,
  plain: "var(--vesper-background-primary)",
};

const AVATAR_SRC = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><defs><linearGradient id='g' x2='1' y2='1'><stop stop-color='#f17ec5'/><stop offset='1' stop-color='#5cbcdb'/></linearGradient></defs><rect width='10' height='10' fill='url(#g)'/></svg>",
)}`;

const CODE = `export function Glass() {
  const glassRef = useGlass({ interactive: true });
  return <div ref={glassRef} className="vesper-glass" />;
}`;

const ROW: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--vesper-spacing-4)",
};

const COLUMN: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--vesper-spacing-4)",
  minWidth: 0,
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={COLUMN}>
      <Typography as="h2" variant="label-md-bold">
        {title}
      </Typography>
      {children}
    </section>
  );
}

function DraggableLens() {
  const ref = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId) || !ref.current) {
      return;
    }

    const parent = ref.current.offsetParent?.getBoundingClientRect();
    ref.current.style.left = `${e.clientX - (parent?.left ?? 0) - offset.current.x}px`;
    ref.current.style.top = `${e.clientY - (parent?.top ?? 0) - offset.current.y}px`;
  };

  return (
    <Material
      ref={ref}
      variant="floating"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      style={{
        position: "absolute",
        top: "var(--vesper-spacing-6)",
        right: "var(--vesper-spacing-10)",
        width: "16rem",
        height: "8rem",
        borderRadius: "4rem",
        cursor: "grab",
        touchAction: "none",
        display: "grid",
        placeItems: "center",
        zIndex: 2,
      }}
    >
      <Typography variant="label-md">drag me around</Typography>
    </Material>
  );
}

function Overlays() {
  const { ref: modalRef, open: openModal, close: closeModal } = useModal();
  const { ref: sheetRef, open: openSheet, close: closeSheet } = useSheet();

  return (
    <div style={ROW}>
      <Button variant="contrast" onClick={openModal}>
        open modal
      </Button>
      <Button variant="tertiary" onClick={openSheet}>
        open sheet
      </Button>
      <Button
        variant="subtle"
        onClick={() =>
          addToast({ content: "Saved to the cloud", variant: "success" })
        }
      >
        show toast
      </Button>
      <Modal
        ref={modalRef}
        title="Glass"
        description="The page refracts through the edges of this dialog."
        buttons={[
          { children: "Cancel", onClick: closeModal },
          { children: "Done", onClick: closeModal },
        ]}
      >
        <TextInput aria-label="Name" placeholder="Your name" />
      </Modal>
      <Sheet
        ref={sheetRef}
        title="Glass sheet"
        description="Slides in on a soft spring."
        buttons={[{ children: "Close", onClick: closeSheet }]}
      >
        <Typography variant="copy-sm">Sheet content</Typography>
      </Sheet>
      <Toasts />
    </div>
  );
}

function GlassGallery({ backdrop }: { backdrop: GlassBackdrop }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "var(--vesper-spacing-10)",
        background: GLASS_BACKDROP_STYLES[backdrop],
        position: "relative",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(22rem, 1fr))",
        alignItems: "start",
        gap: "var(--vesper-spacing-10)",
      }}
    >
      <DraggableLens />
      <Section title="Buttons">
        <div style={ROW}>
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} size="sm">
              {variant}
            </Button>
          ))}
          <Button size="sm" disabled>
            disabled
          </Button>
        </div>
        <div style={ROW}>
          <IconButton aria-label="Search" icon={<Search />} variant="subtle" />
          <IconButton
            aria-label="Tenstorrent"
            icon={<Tenstorrent />}
            variant="primary"
          />
          <SplitButton
            menuItems={[{ text: "Duplicate", onSelect: () => {} }]}
            variant="contrast"
          >
            Deploy
          </SplitButton>
          <TextButton variant="accent">Text button</TextButton>
        </div>
      </Section>

      <Section title="Selection">
        <div style={ROW}>
          <Checkbox text="Checked" defaultChecked />
          <Checkbox text="Unchecked" />
          <Switch label="Switch" defaultChecked />
          <Switch label="Off" />
        </div>
        <RadioGroup
          name="radio"
          orientation="horizontal"
          defaultValue="a"
          options={[
            { value: "a", label: "Glass" },
            { value: "b", label: "Aqua" },
          ]}
        />
        <div style={ROW}>
          <Toggle
            defaultValue="day"
            options={[
              { value: "day", text: "Day" },
              { value: "week", text: "Week" },
              { value: "month", text: "Month" },
            ]}
          />
          <ThemeSwitcher />
        </div>
        <div style={ROW}>
          <Chip selected>Selected</Chip>
          <Chip>Chip</Chip>
          <Chip variant="contrast">Contrast</Chip>
        </div>
      </Section>

      <Section title="Inputs">
        <TextInput
          aria-label="Search"
          placeholder="Search..."
          iconLeft={<Search />}
        />
        <Select
          aria-label="Fruit"
          options={["Apple", "Banana", "Cherry"]}
          defaultValue="Apple"
        />
        <Combobox aria-label="Fruit" options={["Apple", "Banana", "Cherry"]} />
        <TextArea aria-label="Notes" placeholder="Notes" height={72} />
        <FormInputMessage variant="success" message="Looks good" />
      </Section>

      <Section title="Ranges">
        <Slider thumbAriaLabel="Volume" defaultValue={40} showValueLabel />
        <Range thumbAriaLabels={["Min", "Max"]} defaultValues={[20, 70]} />
        <ProgressBar value={64} />
        <ProgressBar value={40} variant="steps" size="lg" />
      </Section>

      <Section title="Navigation">
        <Tabs
          defaultValue="one"
          items={[
            { label: "Overview", value: "one", content: null },
            { label: "Specs", value: "two", content: null },
            { label: "Pricing", value: "three", content: null },
          ]}
        />
        <Tabs
          variant="secondary"
          defaultValue="one"
          items={[
            { label: "Overview", value: "one", content: null },
            { label: "Specs", value: "two", content: null },
          ]}
        />
        <div style={ROW}>
          <Menu items={[{ text: "Rename", onSelect: () => {} }]} as={Button}>
            Menu
          </Menu>
          <Tooltip
            content="Glass tooltip"
            wrapWithButton
            style={{ color: "var(--vesper-text-primary)" }}
          >
            <Typography variant="label-md">Hover for a tooltip</Typography>
          </Tooltip>
        </div>
        <ShowMore />
      </Section>

      <Section title="Labels">
        <div style={ROW}>
          <Badge>Badge</Badge>
          <Badge variant="purple">Purple</Badge>
          <Badge variant="pink" subtle>
            Subtle
          </Badge>
          <Tag>Tag</Tag>
          <Tag variant="success-bold">Shipped</Tag>
          <Tag variant="warning-subtle">Pending</Tag>
        </div>
        <div style={ROW}>
          <StatusIndicator label="Ready" state="ready" variant="badge" />
          <StatusIndicator label="Queued" state="queued" animated />
          <Avatar src={AVATAR_SRC} size="lg" />
          <Avatar size="lg" />
          <AvatarGroup
            avatars={Array.from({ length: 6 }, () => ({ src: AVATAR_SRC }))}
          />
        </div>
        <Typography variant="copy-sm">
          Inline <Code>code</Code> and <Code variant="contrast">contrast</Code>
        </Typography>
        <Snippet>npm install @tenstorrent/vesper</Snippet>
      </Section>

      <Section title="Surfaces">
        <Admonition variant="info">Glass admonition</Admonition>
        <Admonition variant="success" subtle>
          Subtle glass admonition
        </Admonition>
        <Accordion title="Accordion" defaultOpen>
          Accordions condense into glass while open.
        </Accordion>
        <Choicebox
          name="plan"
          defaultValue="pro"
          options={[
            { value: "free", label: "Free", description: "For hobbyists" },
            { value: "pro", label: "Pro", description: "For teams" },
          ]}
        />
        <div style={ROW}>
          <Skeleton width={120} height={16} />
          <Skeleton shape="circle" size={32} />
        </div>
      </Section>

      <Section title="Code">
        <CodeBlock lang={tsx}>{CODE}</CodeBlock>
        <Overlays />
      </Section>
    </div>
  );
}

const meta = {
  title: "Materials/Glass",
  component: GlassGallery,
  excludeStories: /^GLASS_/,
  parameters: { layout: "fullscreen" },
  argTypes: {
    backdrop: { control: "radio", options: GLASS_BACKDROPS },
  },
  args: { backdrop: "type" },
} satisfies Meta<typeof GlassGallery>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
