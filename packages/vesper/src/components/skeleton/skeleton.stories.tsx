import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton, SKELETON_SHAPES } from "@/components/skeleton/skeleton";
import { Button } from "@/components/button/button";

const meta = {
  component: Skeleton,
  parameters: { layout: "centered" },
  argTypes: {
    shape: { control: "radio", options: SKELETON_SHAPES },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    show: true,
    shape: "box",
  },
  render(props) {
    return (
      <Skeleton {...props}>
        <Button variant="contrast">Masked by skeleton</Button>
      </Skeleton>
    );
  },
};
Playground.storyName = "skeleton";
