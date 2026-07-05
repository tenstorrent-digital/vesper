import { type ReactNode, useSyncExternalStore } from "react";
import { type ButtonProps } from "@/components/button/button";

export interface ToastOptions {
  content: ReactNode;
  buttons?: Omit<ButtonProps, "size" | "as">[];
  timeout?: number | false;
  dismissable?: boolean;
}

export type ToastState = "entering" | "active" | "dismissed";

export interface ToastData {
  options: ToastOptions;
  id: string;
  state: ToastState;
}

export const TOAST_DEFAULT_TIMEOUT = 5000;

class ToastsStore {
  static toasts: ToastData[] = [];

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

    const toast: ToastData = {
      options: { ...options, timeout },
      id: crypto.randomUUID(),
      state: "entering",
    };

    this.toasts = [...this.toasts, toast];

    if (timeout !== false) {
      setTimeout(() => this.dismissToast(toast.id), timeout);
    }

    this.emitChange();
    return () => this.dismissToast(toast.id);
  };

  static updateToastState = (id: string, state: ToastState) => {
    this.toasts = this.toasts.map((t) => {
      if (t.id !== id) return t;
      return { ...t, state };
    });
    this.emitChange();
  };

  static dismissToast = (id: string) => {
    this.updateToastState(id, "dismissed");
    this.emitChange();
  };

  static destroyToast = (id: string) => {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.emitChange();
  };
}

export const addToast = ToastsStore.addToast;

export const dismissToast = ToastsStore.dismissToast;

export const updateToastState = ToastsStore.updateToastState;

export const destroyToast = ToastsStore.destroyToast;

export const useToasts = () =>
  useSyncExternalStore(
    ToastsStore.subscribe,
    ToastsStore.getSnapshot,
    ToastsStore.getSnapshot,
  );
