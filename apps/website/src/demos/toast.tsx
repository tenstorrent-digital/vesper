"use client";

import { Button } from "@tenstorrent/vesper/button";
import { addToast, type ToastOptions, Toasts } from "@tenstorrent/vesper/toast";

type ToastDemoProps =
  | { kind: "container" }
  | { kind: "spawner"; options: ToastOptions }
  | {
      kind: "updating-spawner";
      options: [ToastOptions, ToastOptions];
      timeout: number;
    };

export function ToastDemo(props: ToastDemoProps) {
  if (props.kind === "container") {
    return <Toasts />;
  }

  if (props.kind === "spawner") {
    if (props.options.action) {
      props.options.action.handler = () => {};
    }

    return <Button onClick={() => addToast(props.options)}>Show toast</Button>;
  }

  if (props.kind === "updating-spawner") {
    return (
      <Button
        onClick={() => {
          const [optionsA, optionsB] = props.options.map((o) => {
            if (o.action) o.action.handler = () => {};
            return o;
          });
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
