import type { Meta, StoryObj } from "@storybook/react-vite";

import { Icon, ICON_KINDS, type IconKind } from "@/components/icons/icons";
import { Select, SELECT_SIZES } from "@/components/select/select";

const meta = {
  component: Select,
  argTypes: {
    size: { control: "radio", options: SELECT_SIZES },
    icon: { control: "select", options: ICON_KINDS },
    options: { table: { disable: true } },
    value: { table: { disable: true } },
    form: { table: { disable: true } },
    container: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  render: function Render(props) {
    return (
      <Select
        style={{ width: "min(calc(100vw - 4rem), 15rem)" }}
        {...props}
        icon={props.icon ? <Icon kind={props.icon as IconKind} /> : undefined}
      />
    );
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "md",
    placeholder: "Select an option",
    disabled: false,
    options: [
      { value: "lions", label: "Lions" },
      { value: "tigers", label: "Tigers" },
      { value: "bears", label: "Bears" },
      { value: "oh_my", label: "Oh my" },
    ],
    icon: false as unknown as boolean,
    required: false,
  },
};
Playground.storyName = "select";
