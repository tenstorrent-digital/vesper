import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  type ToastOptions,
  Toasts,
  addToast,
  TOAST_VARIANTS,
} from "@/components/toast/toast";
import { Button } from "@/components/button/button";

function ToastStoryComponent({
  content,
  useTimeout,
  withButtons,
  timeout,
  variant,
}: Omit<ToastOptions, "buttons"> & {
  withButtons: boolean;
  useTimeout: boolean;
}) {
  return (
    <>
      <Button
        variant="contrast"
        onClick={() => {
          const toast = addToast({
            content,
            timeout: useTimeout ? timeout : false,
            buttons: withButtons
              ? [
                  {
                    altText: "Go to dashboard to undo",
                    content: "Undo",
                    handler: () => toast.dismiss(),
                  },
                  {
                    content: "Dismiss",
                    handler: () => toast.dismiss(),
                  },
                ]
              : [],
            variant,
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
  argTypes: {
    variant: { options: TOAST_VARIANTS, control: "select" },
  },
} satisfies Meta<typeof ToastStoryComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "default",
    content:
      "Don't be afraid to make decisions. Put your feelings into it, your heart, it's your world. You are just a whisper floating across a mountain.",
    withButtons: false,
    useTimeout: true,
    timeout: 5000,
  },
};
Playground.storyName = "toast";
