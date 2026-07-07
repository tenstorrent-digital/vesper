import { type ReactNode, useSyncExternalStore } from "react";
import { type ButtonProps } from "@/components/button/button";

export const TOAST_ROLES = ["status", "alert"] as const;

export const TOAST_VARIANTS = [
  "default",
  "loading",
  "success",
  "warning",
  "danger",
] as const;

export interface ToastOptions {
  content: ReactNode;
  buttons?: Omit<ButtonProps, "size" | "as">[];
  timeout?: number | false;
  variant?: ToastVariant;
}

export type ToastState = "entering" | "active" | "dismissed";

export type ToastRole = (typeof TOAST_ROLES)[number];

export type ToastVariant = (typeof TOAST_VARIANTS)[number];

export interface ToastData {
  options: ToastOptions;
  id: string;
  state: ToastState;
}

class ToastsStore {
  toasts: ToastData[] = [];

  listeners = new Set<() => void>();
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.toasts;

  emitChange = () => {
    for (const listener of this.listeners) {
      listener();
    }
  };

  addToast = ({
    content,
    buttons = [],
    timeout = false,
    variant = "default",
  }: ToastOptions) => {
    const toast: ToastData = {
      options: { content, buttons, timeout, variant },
      id: crypto.randomUUID(),
      state: "entering",
    };

    this.toasts = [...this.toasts, toast];
    this.emitChange();

    return {
      dismiss: () => this.dismissToast(toast.id),
      update: (updates: Partial<ToastOptions>) =>
        this.updateToast(toast.id, updates),
    };
  };

  updateToast = (id: string, updates: Partial<ToastOptions>) => {
    this.toasts = this.toasts.map((t) => {
      if (t.id !== id) return t;
      return { ...t, options: { ...t.options, ...updates } };
    });
    this.emitChange();
  };

  updateToastState = (id: string, state: ToastState) => {
    this.toasts = this.toasts.map((t) => {
      if (t.id !== id) return t;
      return { ...t, state };
    });
    this.emitChange();
  };

  dismissToast = (id: string) => {
    this.updateToastState(id, "dismissed");
    this.emitChange();
  };

  destroyToast = (id: string) => {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.emitChange();
  };

  dismissOldestToast = () => {
    const oldestActiveToast = [...this.toasts].find(
      (t) => t.state === "active" || t.state === "entering",
    );

    if (oldestActiveToast) {
      this.dismissToast(oldestActiveToast.id);
    }
  };

  destroyAllToasts = () => {
    this.toasts = [];
    this.emitChange();
  };
}

export const store = new ToastsStore();

export const useToasts = () =>
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
