import type { Meta, StoryObj } from "@storybook/react-vite";

import { Globe } from "@/components/icons/icons";
import { TextInput } from "@/components/text-input/text-input";

const meta = {
  component: TextInput,
  argTypes: {
    icon: { control: "boolean", name: "icon (no effect on multiline inputs)" },
    height: {
      control: "number",
      name: "height (only affects multiline inputs)",
    },
    type: { table: { disable: true } },
    inputRef: { table: { disable: true } },
  },
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "default",
    size: "md",
    disabled: false,
    label: "Label",
    placeholder: "This is placeholder text",
    icon: false,
    message: "This is a message you can display under the input.",
    multiline: false,
    height: 104 as unknown as undefined,
  },
  render: (props) => {
    if (props.multiline) {
      return (
        <TextInput
          {...props}
          style={{ width: "min(calc(100vw - 4rem), 400px)" }}
        />
      );
    }
    return (
      <TextInput
        {...props}
        style={{ width: "min(calc(100vw - 4rem), 400px)" }}
        icon={props.icon ? <Globe /> : undefined}
      />
    );
  },
};
Playground.storyName = "text-input";
