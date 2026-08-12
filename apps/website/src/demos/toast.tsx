"use client";

import { Button } from "@tenstorrent/vesper/button";
import { addToast, Toasts } from "@tenstorrent/vesper/toast";

export function ToastDemo() {
  return (
    <>
      <Button
        onClick={() =>
          addToast({ content: "Hello from Vesper!", timeout: 5000 })
        }
      >
        Show Toast
      </Button>
      <Toasts />
    </>
  );
}
