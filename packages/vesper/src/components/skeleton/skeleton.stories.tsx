import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton, SKELETON_SHAPES } from "@/components/skeleton/skeleton";
import { Button } from "@/components/button/button";
import { ProgressBar } from "@/components/progress-bar/progress-bar";
import { Avatar } from "@/components/avatar/avatar";

const meta = {
  component: Skeleton,
  argTypes: {
    shape: { control: "radio", options: SKELETON_SHAPES },
    width: { table: { disable: true } },
    height: { table: { disable: true } },
    size: { table: { disable: true } },
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
    if (props.shape === "pill") {
      return (
        <div style={{ width: "min(calc(100vw - 4rem), 200px)" }}>
          <Skeleton {...props}>
            <ProgressBar size="lg" value={77} />
          </Skeleton>
        </div>
      );
    }

    if (props.shape === "circle") {
      return (
        <Skeleton {...props}>
          <Avatar size="lg" src="https://unsplash.it/200/200" />
        </Skeleton>
      );
    }

    return (
      <Skeleton {...props}>
        <Button variant="contrast">Masked by skeleton</Button>
      </Skeleton>
    );
  },
};
Playground.storyName = "skeleton";
