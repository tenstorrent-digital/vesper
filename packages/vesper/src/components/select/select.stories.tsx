import type { Meta, StoryObj } from "@storybook/react-vite";

import { Icon, ICON_KINDS, type IconKind } from "@/components/icons/icons";
import {
  Select,
  SELECT_SIZES,
  type SelectProps,
} from "@/components/select/select";

function SelectStoryComponent({
  icon,
  ...props
}: Pick<SelectProps, "size" | "disabled" | "placeholder"> & {
  icon?: IconKind;
}) {
  return (
    <Select
      style={{ width: "min(calc(100vw - 4rem), 240px)" }}
      icon={icon ? <Icon kind={icon} /> : undefined}
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
    icon: { control: "select", options: ICON_KINDS },
  },
} satisfies Meta<typeof SelectStoryComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "lg",
    placeholder: "Select an option",
    disabled: false,
  },
};
Playground.storyName = "select";
