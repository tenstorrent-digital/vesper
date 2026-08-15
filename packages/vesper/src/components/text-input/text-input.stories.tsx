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
    height: {
      control: "number",
      name: "height",
      description: "only affects multiline inputs",
    },
    type: { table: { disable: true } },
    inputRef: { table: { disable: true } },
    prefix: {
      control: "boolean",
      description: "no effect on multiline inputs",
    },
    mask: { control: "text" },
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
    multiline: false,
    height: 104 as unknown as undefined,
    prefix: false as unknown as TextInputPrefixProps,
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
        iconLeft={props.iconLeft ? <Search /> : undefined}
        iconRight={props.iconRight ? <Close /> : undefined}
        prefix={
          props.prefix
            ? {
                options: ["+1", "+44", "+51"],
                name: "area-code",
                ariaLabel: "Area code",
                defaultValue: "+1",
                width: 58,
              }
            : undefined
        }
      />
    );
  },
};
Playground.storyName = "text-input";
