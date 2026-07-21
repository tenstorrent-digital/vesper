"use client";

import { type ReactNode, useSyncExternalStore } from "react";

import { type ButtonVariant } from "@/components/button/button";

import { generateId } from "@/utils/generateId";

export const TOAST_VARIANTS = [
  "default",
  "loading",
  "success",
  "warning",
  "danger",
] as const;

export interface ToastOptions {
  content: ReactNode;
  buttons?: {
    variant?: ButtonVariant;
    handler: () => void;
    content: ReactNode;
    altText?: string;
  }[];
  timeout?: number | false;
  variant?: ToastVariant;
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

  addToast = ({
    content,
    buttons = [],
    timeout = false,
    variant = "default",
  }: ToastOptions) => {
    const toast: ToastData = {
      options: { content, buttons, timeout, variant },
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
