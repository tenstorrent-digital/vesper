"use client";

import type { ReactNode } from "react";

import { Button } from "@tenstorrent/vesper/button";
import { addToast, type ToastOptions, Toasts } from "@tenstorrent/vesper/toast";

type ToastDemoProps =
  | {
      kind: "container";
    }
  | { kind: "spawner"; options: ToastOptions; children?: ReactNode }
  | {
      kind: "async-spawner";
      options: [ToastOptions, ToastOptions];
      children?: ReactNode;
      timeout: number;
    };

export function ToastDemo(props: ToastDemoProps) {
  if (props.kind === "container") {
    return <Toasts />;
  }

  if (props.kind === "spawner") {
    return (
      <Button onClick={() => addToast(props.options)}>{props.children}</Button>
    );
  }

  if (props.kind === "async-spawner") {
    return (
      <Button
        onClick={() => {
          const [optionsA, optionsB] = props.options;
          const toast = addToast(optionsA);
          setTimeout(() => toast.update(optionsB), props.timeout);
        }}
      >
        {props.children}
      </Button>
    );
  }
}
