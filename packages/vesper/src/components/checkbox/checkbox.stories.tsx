import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox, CHECKBOX_VARIANTS } from "@/components/checkbox/checkbox";

const meta = {
  component: Checkbox,
  argTypes: {
    defaultChecked: { table: { disable: true } },
    checked: { table: { disable: true } },
    name: { table: { disable: true } },
    onChange: { table: { disable: true } },
    inputRef: { table: { disable: true } },
    variant: { control: "radio", options: CHECKBOX_VARIANTS },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "md",
    text: "Sign up for our newsletter",
    disabled: false,
    indeterminate: true,
    required: false,
    defaultChecked: true,
    message: "",
    label: "",
    variant: "default",
  },
};
Playground.storyName = "checkbox";
