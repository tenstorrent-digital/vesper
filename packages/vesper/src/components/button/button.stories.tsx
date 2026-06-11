import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, type ButtonProps } from "./button";
import { Tenstorrent } from "../icon/tenstorrent";
import { Globe } from "../icon/globe";

const meta = {
  title: "Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      table: { disable: true },
    },
    size: {
      control: "radio",
      options: ["lg", "md", "sm", "xs"],
      name: "Button size",
    },
    showLeftIcon: {
      control: "boolean",
      name: "Show right icon?",
    },
    showRightIcon: {
      control: "boolean",
      name: "Show right icon?",
    },
    disabled: {
      name: "Disabled?",
    },
    children: {
      name: "Button text",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

const createStory = (variant: ButtonProps["variant"]): Story => ({
  args: {
    variant,
    size: "lg",
    children: "Explore",
    disabled: false,
    showLeftIcon: false,
    showRightIcon: false,
  },
  render: ({
    size,
    variant,
    disabled,
    children,
    showLeftIcon = false,
    showRightIcon = false,
  }) => (
    <Button
      size={size}
      variant={variant}
      disabled={disabled}
      iconLeft={showLeftIcon && <Globe />}
      iconRight={showRightIcon && <Tenstorrent />}
    >
      {children}
    </Button>
  ),
});

export const Primary: Story = createStory("primary");
export const Contrast: Story = createStory("contrast");
export const Tertiary: Story = createStory("tertiary");
export const Ghost: Story = createStory("ghost");
export const Subtle: Story = createStory("subtle");
export const Warning: Story = createStory("warning");
export const Danger: Story = createStory("danger");
