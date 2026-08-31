import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  SCROLL_THUMB_VISIBILITIES,
  ScrollArea,
} from "@/components/scroll-area/scroll-area";
import { Typography } from "@/components/typography/typography";

const meta = {
  component: ScrollArea,
  argTypes: {
    thumbVisibility: { control: "radio", options: SCROLL_THUMB_VISIBILITIES },
    as: { table: { disable: true } },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    thumbVariant: "default",
    thumbVisibility: "always",
  },
  render(props) {
    return (
      <ScrollArea
        {...props}
        style={{
          width: "min(calc(100vw - 4rem), 24rem)",
          height: "10rem",
        }}
      >
        <Typography
          variant="copy-xl"
          style={{
            color: "var(--vesper-text-primary)",
            background: "var(--vesper-stone-300)",
            padding: "0.75rem",
          }}
        >
          {LOREM_IPSUM}
        </Typography>
      </ScrollArea>
    );
  },
};
Playground.storyName = "scroll-area";

const LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
minim veniam, quis nostrud exercitation ullamco laboris nisi ut
aliquip ex ea commodo consequat.

Duis aute irure dolor in
reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum`;
