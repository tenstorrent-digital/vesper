"use client";

import { Button } from "@tenstorrent/vesper/button";
import {
  addToast,
  type ToastAction,
  type ToastOptions,
  Toasts,
} from "@tenstorrent/vesper/toast";

type ToastDemoOptions = Omit<ToastOptions, "action"> & {
  action?: Omit<ToastAction, "handler">;
};

type ToastDemoProps =
  | { kind: "container" }
  | { kind: "spawner"; options: ToastDemoOptions }
  | {
      kind: "updating-spawner";
      options: [ToastDemoOptions, ToastDemoOptions];
      timeout: number;
    };

const getToastOptions = (demoOption: ToastDemoOptions): ToastOptions => ({
  ...demoOption,
  action: demoOption.action
    ? { ...demoOption.action, handler() {} }
    : undefined,
});

export function ToastDemo(props: ToastDemoProps) {
  if (props.kind === "container") {
    return <Toasts />;
  }

  if (props.kind === "spawner") {
    return (
      <Button onClick={() => addToast(getToastOptions(props.options))}>
        Show toast
      </Button>
    );
  }

  if (props.kind === "updating-spawner") {
    return (
      <Button
        onClick={() => {
          const [optionsA, optionsB] = props.options.map(getToastOptions);
          const toast = addToast(optionsA!);
          setTimeout(() => toast.update(optionsB!), props.timeout);
        }}
      >
        Show toast
      </Button>
    );
  }

  return null;
}
