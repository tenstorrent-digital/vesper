import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ReactNode } from "react";
import {
  MODAL_BUTTONS_ALIGNMENTS,
  Modal,
  type ModalProps,
  useModal,
} from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import { TextInput } from "@/components/text-input/text-input";

function ModalStoryComponent({
  withButtons,
  contents,
  ...props
}: ModalProps & {
  withButtons: boolean;
  contents: "none" | "inputs" | "long text";
}) {
  const modal = useModal();

  let children: ReactNode = null;
  switch (contents) {
    case "inputs":
      children = (
        <div>
          <TextInput label="Name" name="name" />
          <TextInput
            label="Username"
            name="username"
            style={{ marginTop: "var(--vesper-spacing-4)" }}
          />
        </div>
      );
      break;
    case "long text":
      children = LONG_TEXT_CONTENT;
      break;
    case "none":
      children = null;
      break;
    default:
      break;
  }

  return (
    <>
      <Button onClick={modal.open} variant="contrast">
        open modal
      </Button>
      <Modal
        ref={modal.ref}
        {...props}
        buttons={
          withButtons
            ? [
                {
                  children: "cancel",
                  onClick: () => modal.close(),
                },
                {
                  children: "continue",
                  onClick: () => modal.close(),
                },
              ]
            : []
        }
      >
        {children}
      </Modal>
    </>
  );
}

const meta = {
  component: ModalStoryComponent,
  parameters: { layout: "centered" },
  argTypes: {
    buttonsAlignment: { options: MODAL_BUTTONS_ALIGNMENTS, control: "radio" },
    contents: { options: ["inputs", "long text", "none"], control: "radio" },
  },
} satisfies Meta<typeof ModalStoryComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    width: 452,
    maxHeight: 640,
    title: "Are you absolutely sure?",
    description:
      "This action cannot be undone. This will permanently delete your account from our servers.",
    withButtons: true,
    buttonsAlignment: "end",
    contents: "inputs",
    closeOnClickOutside: false,
  },
};
Playground.storyName = "modal";

const LONG_TEXT_CONTENT = `It's amazing what you can do with a little love in your heart. Everything is happy if you choose to make it that way. If you don't think every day is a good day - try missing a few. You'll see. That's what makes life fun. That you can make these decisions. That you can create the world that you want. If I paint something, I don't want to have to explain what it is.

We must be quiet, soft and gentle. Water's like me. It's laaazy ... Boy, it always looks for the easiest way to do things I guess I'm a little weird. I like to talk to trees and animals. That's okay though; I have more fun than most people. There's not a thing in the world wrong with washing your brush. You need the dark in order to show the light.

They say everything looks better with odd numbers of things. But sometimes I put even numbers—just to upset the critics. There comes a nice little fluffer. There are no limits in this world. The more we do this - the more it will do good things to our heart. It's hard to see things when you're too close. Take a step back and look. Don't hurry. Take your time and enjoy.

Let that brush dance around there and play. We don't have to be committed. We are just playing here. Everybody's different. Trees are different. Let them all be individuals. This is your world, whatever makes you happy you can put in it. Go crazy. Go out on a limb - that's where the fruit is.

Everyone is going to see things differently - and that's the way it should be. If there are two big trees, eventually there will be a little tree. That is when you can experience true joy, when you have no fear. It's beautiful - and we haven't even done anything to it yet. No pressure. Just relax and watch it happen. Let's get crazy.

This is probably the greatest thing to happen in my life - to be able to share this with you. The light is your friend. Preserve it. You can't make a mistake. Anything that happens you can learn to use - and make something beautiful out of it. Just a happy little shadow that lives in there You have to make almighty decisions when you're the creator.

This is the fun part I can't think of anything more rewarding than being able to express yourself to others through painting. You can do anything here. So don't worry about it.`;
