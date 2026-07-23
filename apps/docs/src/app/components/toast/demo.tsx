"use client";

import { Button } from "@repo/vesper/button";
import { addToast, Toasts } from "@repo/vesper/toast";

export function ToastDemo() {
  return (
    <>
      <Button onClick={() => addToast({ content: "Hello from Vesper!" })}>
        Show Toast
      </Button>
      <Toasts />
    </>
  );
}
