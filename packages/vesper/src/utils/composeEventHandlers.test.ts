import type { SyntheticEvent } from "react";
import { describe, expect, test, vi } from "vitest";

import { composeEventHandlers } from "@/utils/composeEventHandlers";

const createEvent = () =>
  ({
    preventDefault: vi.fn(),
    defaultPrevented: false,
  }) as unknown as SyntheticEvent;

describe("composeEventHandlers", () => {
  test("calls the consumer handler before the internal one", () => {
    const calls: string[] = [];
    const consumer = () => calls.push("consumer");
    const internal = () => calls.push("internal");

    composeEventHandlers(consumer, internal)(createEvent());

    expect(calls).toEqual(["consumer", "internal"]);
  });

  test("calls the internal handler when no consumer handler is supplied", () => {
    const internal = vi.fn();

    composeEventHandlers(undefined, internal)(createEvent());

    expect(internal).toHaveBeenCalledTimes(1);
  });

  test("still calls the internal handler after the consumer calls preventDefault", () => {
    const internal = vi.fn();
    const consumer = (event: SyntheticEvent) => event.preventDefault();

    composeEventHandlers(consumer, internal)(createEvent());

    expect(internal).toHaveBeenCalledTimes(1);
  });

  test("passes the same event to both handlers", () => {
    const event = createEvent();
    const consumer = vi.fn();
    const internal = vi.fn();

    composeEventHandlers(consumer, internal)(event);

    expect(consumer).toHaveBeenCalledWith(event);
    expect(internal).toHaveBeenCalledWith(event);
  });
});
