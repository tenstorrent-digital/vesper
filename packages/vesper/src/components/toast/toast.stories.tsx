import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toasts, addToast } from "@/components/toast/toast";
import { Button } from "@/components/button/button";

function ToastStoryComponent() {
  return (
    <>
      <Button
        variant="contrast"
        onClick={() => {
          const dismissToast = addToast({
            content:
              "Just relax and let it flow. That easy. Exercising the imagination, experimenting with talents, being creative; these things, to me, are truly the windows to your soul. Go out on a limb - that's where the fruit is.",
            buttons: [
              { children: "Undo" },
              { children: "Dismiss", onClick: () => dismissToast() },
            ],
          });
        }}
      >
        add toast
      </Button>
      <Toasts />
    </>
  );
}

const meta = {
  component: ToastStoryComponent,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ToastStoryComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "toast";
