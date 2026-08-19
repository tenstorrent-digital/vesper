import type { Meta, StoryObj } from "@storybook/react-vite";

import { Close, Search } from "@/components/icons/icons";
import { MaskedInput } from "@/components/masked-input/masked-input";
import {
  TEXT_INPUT_SIZES,
  TEXT_INPUT_VARIANTS,
  TextInputDropdownProps,
} from "@/components/text-input/text-input";

const meta = {
  component: MaskedInput,
  argTypes: {
    iconLeft: { control: "boolean" },
    iconLeftAction: { table: { disable: true } },
    iconRight: { control: "boolean" },
    iconRightAction: { table: { disable: true } },
    type: { table: { disable: true } },
    inputRef: { table: { disable: true } },
    dropdown: { control: "boolean" },
    mask: { control: "text" },
    size: { control: "radio", options: TEXT_INPUT_SIZES },
    variant: { control: "radio", options: TEXT_INPUT_VARIANTS },
  },
} satisfies Meta<typeof MaskedInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "default",
    size: "md",
    disabled: false,
    label: "Label",
    placeholder: "Enter a NA phone number",
    iconLeft: false,
    iconRight: false,
    message: "This is a message you can display under the input.",
    dropdown: false as unknown as TextInputDropdownProps,
    mask: "+1 (___) ___-____",
  },
  render(props) {
    return (
      <MaskedInput
        {...props}
        style={{ width: "min(calc(100vw - 4rem), 400px)" }}
        iconLeft={props.iconLeft ? <Search /> : undefined}
        iconRight={props.iconRight ? <Close /> : undefined}
        mask={props.mask}
        dropdown={
          props.dropdown
            ? {
                options: ["US", "CA"],
                name: "country-code",
                ariaLabel: "Country code",
                defaultValue: "US",
              }
            : undefined
        }
      />
    );
  },
};
Playground.storyName = "masked-input";
