import { RefObject } from "react";
import { describe, expect, test } from "vitest";

import { getPortalContainer } from "@/utils/getPortalContainer";

describe("getPortalContainer", () => {
  test("returns the container when one is provided", () => {
    const container = document.createElement("div");
    const trigger = document.createElement("button");

    expect(getPortalContainer(container, trigger)).toBe(container);
  });

  test("returns the container when one is provided without a trigger", () => {
    const container = document.createElement("div");

    expect(getPortalContainer(container, null)).toBe(container);
  });

  test("returns a shadow root container", () => {
    const host = document.createElement("div");
    const container = host.attachShadow({ mode: "open" });

    expect(getPortalContainer(container, null)).toBe(container);
  });

  test("returns a ref object container", () => {
    const container: RefObject<HTMLElement | null> = {
      current: document.createElement("div"),
    };
    const trigger = document.createElement("button");

    expect(getPortalContainer(container, trigger)).toBe(container);
  });

  test("returns a ref object container whose current value is null", () => {
    const container: RefObject<HTMLElement | null> = { current: null };

    expect(getPortalContainer(container, null)).toBe(container);
  });

  test("container takes precedence over the closest dialog ancestor", () => {
    const container = document.createElement("div");
    const dialog = document.createElement("dialog");
    const trigger = document.createElement("button");
    dialog.append(trigger);

    expect(getPortalContainer(container, trigger)).toBe(container);
  });

  test("ref object container takes precedence over the closest dialog ancestor", () => {
    const container: RefObject<HTMLElement | null> = {
      current: document.createElement("div"),
    };
    const emptyContainer: RefObject<HTMLElement | null> = { current: null };
    const dialog = document.createElement("dialog");
    const trigger = document.createElement("button");
    dialog.append(trigger);

    expect(getPortalContainer(container, trigger)).toBe(container);
    expect(getPortalContainer(emptyContainer, trigger)).toBe(emptyContainer);
  });

  test("falls back to default behavior when the container is null", () => {
    const dialog = document.createElement("dialog");
    const trigger = document.createElement("button");
    dialog.append(trigger);

    expect(getPortalContainer(null, trigger)).toBe(dialog);
    expect(getPortalContainer(null, null)).toBeUndefined();
  });

  test("returns the closest dialog ancestor when no container is provided", () => {
    const dialog = document.createElement("dialog");
    const wrapper = document.createElement("div");
    const trigger = document.createElement("button");

    wrapper.append(trigger);
    dialog.append(wrapper);

    expect(getPortalContainer(undefined, trigger)).toBe(dialog);
  });

  test("returns undefined when the trigger has no dialog ancestor", () => {
    const trigger = document.createElement("button");

    expect(getPortalContainer(undefined, trigger)).toBeUndefined();
  });

  test("returns undefined when there is no container or trigger", () => {
    expect(getPortalContainer(undefined, null)).toBeUndefined();
    expect(getPortalContainer(undefined, undefined)).toBeUndefined();
  });
});
