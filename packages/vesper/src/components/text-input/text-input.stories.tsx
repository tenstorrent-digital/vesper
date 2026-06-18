import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextInput } from "@/components/text-input/text-input";
import { Globe } from "@/components/icons/icons";

const meta = {
  component: TextInput,
  parameters: { layout: "centered" },
  argTypes: {
    icon: { control: "boolean" },
    type: { table: { disable: true } },
    inputRef: { table: { disable: true } },
  },
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "default",
    size: "lg",
    disabled: false,
    label: "Label",
    placeholder: "This is placeholder text",
    icon: false,
    message: "This is a message you can display under the input.",
  },
  render: ({ icon = false, ...props }) => (
    <TextInput
      style={{ width: "min(calc(100vw - 4rem), 400px)" }}
      icon={icon ? <Globe /> : undefined}
      {...props}
    />
  ),
};
Playground.storyName = "text-input";
