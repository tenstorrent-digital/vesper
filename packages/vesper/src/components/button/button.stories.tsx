import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@repo/vesper/button";
import { Tenstorrent, Globe } from "@repo/vesper/icons";

const meta = {
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "radio",
      options: [
        "primary",
        "contrast",
        "tertiary",
        "subtle",
        "ghost",
        "danger",
        "warning",
      ],
      name: "Button size",
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

export const Playground: Story = {
  args: {
    variant: "primary",
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
};
Playground.storyName = "button";
