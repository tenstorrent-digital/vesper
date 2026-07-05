import { type ReactNode, useMemo, useSyncExternalStore } from "react";
import { type ButtonProps } from "@/components/button/button";

export interface ToastOptions {
  content: ReactNode;
  buttons?: Omit<ButtonProps, "size" | "as">[];
  timeout?: number | false;
  dismissable?: boolean;
}

export const TOAST_DEFAULT_TIMEOUT = 5000;

class ToastsStore {
  static toasts: { options: ToastOptions; id: string }[] = [];

  static listeners = new Set<() => void>();
  static subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  static getSnapshot = () => this.toasts;

  static emitChange = () => {
    for (const listener of this.listeners) {
      listener();
    }
  };

  static addToast = (options: ToastOptions) => {
    const timeout = options.timeout ?? TOAST_DEFAULT_TIMEOUT;

    const toast = {
      options: { ...options, timeout },
      id: crypto.randomUUID(),
    };

    this.toasts = [...this.toasts, toast];

    if (timeout !== false) {
      setTimeout(() => this.dismissToast(toast.id), timeout);
    }

    this.emitChange();
    return () => this.dismissToast(toast.id);
  };

  static dismissToast = (_id: string) => {
    this.toasts = this.toasts.filter((t) => t.id !== _id);
    this.emitChange();
  };
}

export const addToast = ToastsStore.addToast;

export const dismissToast = ToastsStore.dismissToast;

export const useToasts = () =>
  useSyncExternalStore(
    ToastsStore.subscribe,
    ToastsStore.getSnapshot,
    ToastsStore.getSnapshot,
  );
