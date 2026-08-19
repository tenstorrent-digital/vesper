import type { Meta, StoryObj } from "@storybook/react-vite";

import { Close, Search } from "@/components/icons/icons";
import {
  TextInput,
  type TextInputPrefixProps,
} from "@/components/text-input/text-input";

const meta = {
  component: TextInput,
  argTypes: {
    iconLeft: {
      control: "boolean",
      description: "no effect on multiline inputs",
    },
    iconLeftAriaLabel: { table: { disable: true } },
    iconLeftOnClick: { table: { disable: true } },
    iconRight: {
      control: "boolean",
      description: "no effect on multiline inputs",
    },
    iconRightAriaLabel: { table: { disable: true } },
    iconRightOnClick: { table: { disable: true } },
    type: { table: { disable: true } },
    inputRef: { table: { disable: true } },
    prefix: {
      control: "boolean",
      description: "no effect on multiline inputs",
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
    label: "Label",
    placeholder: "This is placeholder text",
    iconLeft: false,
    iconRight: false,
    message: "This is a message you can display under the input.",
    prefix: false as unknown as TextInputPrefixProps,
  },
  render: (props) => {
    return (
      <TextInput
        {...props}
        style={{ width: "min(calc(100vw - 4rem), 400px)" }}
        iconLeft={props.iconLeft ? <Search /> : undefined}
        iconRight={props.iconRight ? <Close /> : undefined}
        prefix={
          props.prefix
            ? {
                options: ["USD", "CAD"],
                name: "currency",
                ariaLabel: "Currency",
                defaultValue: "USD",
              }
            : undefined
        }
      />
    );
  },
};
Playground.storyName = "text-input";
