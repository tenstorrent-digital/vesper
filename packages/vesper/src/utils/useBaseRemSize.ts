"use client";

import { useSyncExternalStore } from "react";

class BaseRemSizeObserver {
  static baseRemSize = 16;

  static observer: ResizeObserver | null = null;
  static el: HTMLSpanElement | null = null;

  static listeners = new Set<() => void>();

  static subscribe = (listener: () => void) => {
    if (this.listeners.size === 0) this.observe();
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) this.unobserve();
    };
  };

  static getSnapshot = () => this.baseRemSize;

  static emitChanges = () => this.listeners.forEach((listener) => listener());

  static observe = () => {
    const el = document.createElement("span");
    el.style.position = "fixed";
    el.style.zIndex = "-999999";
    el.style.display = "block";
    el.style.height = "1rem";
    el.style.visibility = "hidden";
    el.style.pointerEvents = "none";
    el.setAttribute("aria-hidden", "true");
    document.body.append(el);

    const updateBaseRemSize = () => {
      this.baseRemSize = el.getBoundingClientRect().height;
      this.emitChanges();
    };
    updateBaseRemSize();

    const observer = new ResizeObserver(updateBaseRemSize);
    observer.observe(el);

    this.el = el;
    this.observer = observer;
  };

  static unobserve = () => {
    this.observer?.disconnect();
    this.el?.remove();
  };
}

export function useBaseRemSize() {
  return useSyncExternalStore(
    BaseRemSizeObserver.subscribe,
    BaseRemSizeObserver.getSnapshot,
    BaseRemSizeObserver.getSnapshot,
  );
}
