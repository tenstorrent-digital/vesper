import type { Meta, StoryObj } from "@storybook/react-vite";

import { Close, Search } from "@/components/icons/icons";
import { TextInput } from "@/components/text-input/text-input";

const meta = {
  component: TextInput,
  argTypes: {
    iconLeft: { control: "boolean" },
    iconRight: { control: "boolean" },
  },
  parameters: {
    controls: {
      include: [
        "variant",
        "size",
        "disabled",
        "placeholder",
        "iconLeft",
        "iconRight",
      ],
    },
  },
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "default",
    size: "md",
    disabled: false,
    placeholder: "This is placeholder text",
    iconLeft: false,
    iconRight: false,
  },
  render: (props) => {
    return (
      <TextInput
        {...props}
        style={{ width: "min(calc(100vw - 4rem), 400px)" }}
        iconLeft={props.iconLeft ? <Search /> : undefined}
        iconRight={props.iconRight ? <Close /> : undefined}
      />
    );
  },
};
Playground.storyName = "text-input";
