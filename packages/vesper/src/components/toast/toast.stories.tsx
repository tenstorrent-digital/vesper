import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/button/button";
import {
  addToast,
  TOAST_VARIANTS,
  type ToastOptions,
  Toasts,
} from "@/components/toast/toast";

function ToastStoryComponent({
  content,
  dismissAfterDelay,
  withButtons,
  variant,
}: Omit<ToastOptions, "buttons" | "timeout"> & {
  withButtons: boolean;
  dismissAfterDelay: boolean;
}) {
  return (
    <>
      <Button
        variant="contrast"
        onClick={() => {
          const toast = addToast({
            content,
            timeout: dismissAfterDelay ? 5000 : false,
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
    withButtons: {
      description:
        "Not a `Toast` component prop; this control is used to easily toggle on/off buttons in the storybook preview UI.",
    },
    dismissAfterDelay: {
      description:
        "Not a `Toast` component prop; this control is used to easily toggle on/off timeout in the storybook preview UI.",
    },
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
    dismissAfterDelay: true,
  },
};
Playground.storyName = "toast";
