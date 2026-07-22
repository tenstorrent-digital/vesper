import type { Meta, StoryObj } from "@storybook/react-vite";

import { Server } from "@/components/icons/icons";
import {
  Select,
  SELECT_SIZES,
  type SelectProps,
} from "@/components/select/select";

function SelectStoryComponent({
  showIcon,
  ...props
}: Pick<SelectProps, "size" | "disabled" | "placeholder"> & {
  showIcon: boolean;
}) {
  return (
    <Select
      style={{ width: "min(calc(100vw - 4rem), 240px)" }}
      icon={showIcon ? <Server /> : undefined}
      options={[
        { value: "lions", label: "Lions" },
        { value: "tigers", label: "Tigers" },
        { value: "bears", label: "Bears" },
        { value: "oh_my", label: "Oh my" },
      ]}
      {...props}
    />
  );
}

const meta = {
  component: SelectStoryComponent,
  argTypes: {
    size: { control: "radio", options: SELECT_SIZES },
    showIcon: {
      description:
        "Not a `Select` component prop; this control is used to easily toggle on/off showing an icon the storybook preview UI.",
    },
  },
} satisfies Meta<typeof SelectStoryComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "lg",
    placeholder: "Select an option",
    disabled: false,
    showIcon: false,
  },
};
Playground.storyName = "select";
