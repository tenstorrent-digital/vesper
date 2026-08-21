import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  TEXT_AREA_SIZES,
  TEXT_AREA_VARIANTS,
  TextArea,
} from "@/components/text-area/text-area";

const meta = {
  component: TextArea,
  argTypes: {
    height: {
      control: "number",
      name: "height",
    },
    size: { control: "radio", options: TEXT_AREA_SIZES },
    variant: { control: "radio", options: TEXT_AREA_VARIANTS },
  },
} satisfies Meta<typeof TextArea>;

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
Playground.storyName = "text-area";
