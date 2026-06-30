import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  RADIO_SIZES,
  RadioGroup,
  type RadioGroupProps,
} from "@/components/radio-group/radio-group";

const RadioGroupStory = (
  props: Omit<RadioGroupProps, "options"> & { disabled: boolean },
) => {
  return (
    <RadioGroup
      options={[
        { value: "option-a", label: "Label" },
        { value: "option-b", label: "Label" },
        { value: "option-c", label: "Label" },
      ]}
      {...props}
    />
  );
};

const meta = {
  component: RadioGroupStory,
  parameters: { layout: "centered" },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["vertical", "horizontal"],
    },
    size: {
      control: "radio",
      options: RADIO_SIZES,
    },
    name: { table: { disable: true } },
  },
} satisfies Meta<typeof RadioGroupStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    orientation: "vertical",
    size: "md",
    disabled: false,
    name: "example",
  },
};
Playground.storyName = "radio-group";
