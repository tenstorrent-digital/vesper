import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  FORM_INPUT_MESSAGE_VARIANTS,
  FormInputMessage,
} from "@/components/form-input-message/form-input-message";

const meta = {
  component: FormInputMessage,
  argTypes: {
    variant: { control: "radio", options: FORM_INPUT_MESSAGE_VARIANTS },
  },
} satisfies Meta<typeof FormInputMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "default",
    children: "The message text",
  },
};
Playground.storyName = "form-input-message";
