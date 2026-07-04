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
            children: "Hello world!\n\n\n",
            dismissable: true,
            timeout: false,
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
