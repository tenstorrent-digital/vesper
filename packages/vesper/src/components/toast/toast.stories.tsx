import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toasts, addToast } from "@/components/toast/toast";
import { Button } from "@/components/button/button";

function ToastStoryComponent() {
  return (
    <>
      <Button
        variant="contrast"
        onClick={() => {
          const toast = addToast({
            variant: "loading",
            content: "Loading...",
          });
          setTimeout(
            () =>
              toast.update({
                variant: "success",
                content: "Success!",
                timeout: 3000,
              }),
            2000,
          );
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
