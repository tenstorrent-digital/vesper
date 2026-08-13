"use client";

import { type ReactNode, useSyncExternalStore } from "react";

import { generateId } from "@/utils/generateId";

export const TOAST_VARIANTS = [
  "default",
  "loading",
  "success",
  "warning",
  "danger",
] as const;

export interface ToastOptions {
  /** The content displayed in the toast. Typically this will be just text, though any `ReactNode` is supported. */
  content: ReactNode;
  /** Optional action to render a button at the bottom of the toast.  */
  action?: {
    /** Callback function that fires when the user clicks the action button. */
    handler: () => void;
    /** The content displayed in the button. Typically this will be just text, though any `ReactNode` is supported. */
    content: ReactNode;
    /** Short description of an alternative way for users to acheive the desired action. This field is important for screen reader users who may not be able to access the toast easily, especially if it is time-sensitive. */
    altText?: string;
  };
  /** The duration in milliseconds the toast will be visible for. Omitting or setting this property to false will show the toast indefinitely until the user dismisses it manually. @default false */
  timeout?: number | false;
  /** Determines which visual style to render the toast in. @default default */
  variant?: ToastVariant;
  /** Customizes the `aria-label` text for the dismiss button. */
  dismissText?: string;
}

export interface ToastHandle {
  /** Dismisses the toast */
  dismiss(): void;
  /** Updates the toast */
  update(options: Partial<ToastOptions>): void;
}

export type ToastState = "entering" | "active" | "dismissed";

export type ToastVariant = (typeof TOAST_VARIANTS)[number];

export interface ToastData {
  options: ToastOptions;
  id: string;
  state: ToastState;
}

class ToastsStore {
  data = {
    toasts: [] as ToastData[],
    announcement: null as string | null,
  };

  listeners = new Set<() => void>();
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.data;

  emitChange = () => {
    for (const listener of this.listeners) {
      listener();
    }
  };

  /**
   * Spawns a new toast, and returns a handle to that toast which allows you to update or dismiss it.
   *
   * @example
   * const toast = addToast({
   *   variant: 'loading',
   *   content: 'Loading...',
   * })
   * await someAsynchronousTask()
   * toast.update({
   *   variant: 'success',
   *   content: 'Success!',
   *   timeout: 5000,
   * })
   * */
  addToast = (options: ToastOptions): ToastHandle => {
    const toast: ToastData = {
      options,
      id: generateId(),
      state: "entering",
    };

    const toasts = [...this.data.toasts, toast];
    this.data = { ...this.data, toasts };
    this.emitChange();

    return {
      dismiss: () => this.dismissToast(toast.id),
      update: (updates: Partial<ToastOptions>) =>
        this.updateToast(toast.id, updates),
    };
  };

  updateToast = (id: string, updates: Partial<ToastOptions>) => {
    const toasts = this.data.toasts.map((t) => {
      if (t.id !== id) return t;
      return { ...t, options: { ...t.options, ...updates } };
    });
    this.data = { ...this.data, toasts };
    this.emitChange();
  };

  updateToastState = (id: string, state: ToastState) => {
    const toasts = this.data.toasts.map((t) => {
      if (t.id !== id) return t;
      return { ...t, state };
    });
    this.data = { ...this.data, toasts };
    this.emitChange();
  };

  dismissToast = (id: string) => {
    this.updateToastState(id, "dismissed");
    this.emitChange();
  };

  destroyToast = (id: string) => {
    const toasts = this.data.toasts.filter((t) => t.id !== id);
    this.data = { ...this.data, toasts };
    this.emitChange();
  };

  destroyAllToasts = () => {
    this.data = { ...this.data, toasts: [] };
    this.emitChange();
  };

  setAnnouncement = (announcement: string | null) => {
    this.data = { ...this.data, announcement };
    this.emitChange();
  };
}

export const store = new ToastsStore();

export const useStore = () =>
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
