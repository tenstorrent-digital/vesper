import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Textarea,
  TEXTAREA_SIZES,
  TEXTAREA_VARIANTS,
} from "@/components/textarea/textarea";

const meta = {
  component: Textarea,
  argTypes: {
    height: {
      control: "number",
      name: "height",
    },
    size: { control: "radio", options: TEXTAREA_SIZES },
    variant: { control: "radio", options: TEXTAREA_VARIANTS },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "default",
    size: "md",
    disabled: false,
    label: "Label",
    placeholder: "Tell us about yourself",
    message: "This is a message you can display under the input.",
    height: 104,
  },
};
Playground.storyName = "textarea";
