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
  role?: ToastRole;
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

  static addToast = ({
    content,
    buttons = [],
    timeout = false,
    role = "status",
    variant = "default",
  }: ToastOptions) => {
    const toast: ToastData = {
      options: { content, buttons, timeout, role, variant },
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

  static updateToast = (id: string, updates: Partial<ToastOptions>) => {
    this.toasts = this.toasts.map((t) => {
      if (t.id !== id) return t;
      return { ...t, options: { ...t.options, ...updates } };
    });
    this.emitChange();
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

  static dismissLastToast = () => {
    const lastActiveToast = [...this.toasts]
      .reverse()
      .find((t) => t.state === "active" || t.state === "entering");

    if (lastActiveToast) {
      this.dismissToast(lastActiveToast.id);
    }
  };
}

export const addToast = ToastsStore.addToast;

export const dismissToast = ToastsStore.dismissToast;

export const updateToastState = ToastsStore.updateToastState;

export const destroyToast = ToastsStore.destroyToast;

export const dismissLastToast = ToastsStore.dismissLastToast;

export const useToasts = () =>
  useSyncExternalStore(
    ToastsStore.subscribe,
    ToastsStore.getSnapshot,
    ToastsStore.getSnapshot,
  );
