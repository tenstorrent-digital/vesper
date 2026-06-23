import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Toggle,
  TOGGLE_SIZES,
  type ToggleProps,
} from "@/components/toggle/toggle";
import { Grid, List } from "@/components/icons/icons";

const ToggleStoryComponent = ({
  size = "lg",
  type,
}: Pick<ToggleProps, "size"> & {
  type: "icons" | "text";
}) => (
  <Toggle
    size={size}
    options={
      type === "text"
        ? [
            { value: "option-a", text: "Option A" },
            { value: "option-b", text: "Option B" },
          ]
        : [
            { value: "option-a", icon: <Grid />, ariaLabel: "Option A" },
            { value: "option-b", icon: <List />, ariaLabel: "Option B" },
          ]
    }
  />
);

const meta = {
  component: ToggleStoryComponent,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "radio", options: TOGGLE_SIZES },
    type: { control: "radio", options: ["icons", "text"] },
  },
} satisfies Meta<typeof ToggleStoryComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { type: "text", size: "lg" } };
Playground.storyName = "toggle";
