import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

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
    onClick: fn(),
  },
  render: ({
    size,
    variant,
    disabled,
    children,
    showLeftIcon = false,
    showRightIcon = false,
    onClick,
  }) => (
    <Button
      size={size}
      variant={variant}
      disabled={disabled}
      iconLeft={showLeftIcon && <Globe />}
      iconRight={showRightIcon && <Tenstorrent />}
      onClick={onClick}
      data-testid="button"
    >
      {children}
    </Button>
  ),
  async play({ canvas, userEvent, args }) {
    await userEvent.click(await canvas.findByTestId("button"));
    await expect(args.onClick).toHaveBeenCalled();
  },
});

export const Primary: Story = createStory("primary");
export const Contrast: Story = createStory("contrast");
export const Tertiary: Story = createStory("tertiary");
export const Ghost: Story = createStory("ghost");
export const Subtle: Story = createStory("subtle");
export const Warning: Story = createStory("warning");
export const Danger: Story = createStory("danger");
