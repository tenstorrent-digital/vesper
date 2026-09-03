"use client";

import { useCallback, useEffect, useState } from "react";

import { IconButton } from "@tenstorrent/vesper/icon-button";
import { AIAgent, AIAgentSolid } from "@tenstorrent/vesper/icons";
import { addToast } from "@tenstorrent/vesper/toast";
import { Tooltip } from "@tenstorrent/vesper/tooltip";

const STORAGE_KEY = "vesper-docs:agent-mode";
const ATTRIBUTE = "data-agent-mode";

/** the classic */
const KONAMI = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

const write = (on: boolean) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // private browsing — the mode just won't persist, which is fine
  }
};

const apply = (on: boolean) => {
  if (on) document.documentElement.setAttribute(ATTRIBUTE, "on");
  else document.documentElement.removeAttribute(ATTRIBUTE);
};

/**
 * a tiny store so the toggle in the top bar and the readout at the bottom of
 * the viewport stay in sync without a provider around the whole server tree
 */
const listeners = new Set<(on: boolean) => void>();

export const setAgentMode = (on: boolean) => {
  apply(on);
  write(on);
  listeners.forEach((listener) => listener(on));
};

const useAgentMode = () => {
  const [on, setOn] = useState(false);

  useEffect(() => {
    // sync with whatever the pre-hydration script already applied
    setOn(document.documentElement.hasAttribute(ATTRIBUTE));

    listeners.add(setOn);
    return () => {
      listeners.delete(setOn);
    };
  }, []);

  return on;
};

/**
 * toggles the phosphor skin
 *
 * ⌥A flips it too, and so does the Konami code — because of course it does
 */
export const AgentModeToggle = () => {
  const on = useAgentMode();

  const toggle = useCallback((next: boolean) => {
    setAgentMode(next);

    addToast({
      variant: next ? "success" : "default",
      timeout: 4000,
      content: next
        ? "Agent mode engaged. Welcome, colleague. \u{1F916}"
        : "Agent mode disengaged. Back to pixels for the humans.",
      action: next
        ? {
            content: "Open the console",
            altText: "Navigate to /agents",
            handler: () => {
              window.location.href = "/agents";
            },
          }
        : undefined,
    });
  }, []);

  // ⌥A
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        toggle(!document.documentElement.hasAttribute(ATTRIBUTE));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  // ↑ ↑ ↓ ↓ ← → ← → B A
  useEffect(() => {
    let progress = 0;

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      progress =
        key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;

      if (progress === KONAMI.length) {
        progress = 0;
        setAgentMode(true);
        addToast({
          variant: "success",
          timeout: 6000,
          content:
            "30 extra lives granted. Agent mode unlocked the old-fashioned way.",
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Tooltip
      content={
        on ? "Leave agent mode (⌥A)" : "Agent mode — for our robot readers (⌥A)"
      }
    >
      <IconButton
        aria-label={on ? "Turn off agent mode" : "Turn on agent mode"}
        aria-pressed={on}
        size="sm"
        variant={on ? "primary" : "ghost"}
        icon={on ? <AIAgentSolid /> : <AIAgent />}
        onClick={() => toggle(!on)}
      />
    </Tooltip>
  );
};

/** the status strip pinned to the bottom of the viewport while the skin is on */
export const AgentModeReadout = () => {
  const on = useAgentMode();
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    if (!on) return;

    const interval = setInterval(() => setUptime((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, [on]);

  if (!on) return null;

  return (
    <div className="agent-mode-readout" role="status">
      <span style={{ animation: "pulse-dot 1.6s ease-in-out infinite" }}>
        ● agent mode
      </span>
      <span>tokens/page ↓ 41%</span>
      <span>vibes ↑ 100%</span>

      <span className="agent-mode-readout-end">
        <span>
          uptime {String(Math.floor(uptime / 60)).padStart(2, "0")}:
          {String(uptime % 60).padStart(2, "0")}
        </span>
        <button type="button" onClick={() => setAgentMode(false)}>
          disengage
        </button>
      </span>
    </div>
  );
};

/**
 * restores the skin before first paint
 *
 * inlined in `<head>` so a reader who left agent mode on never sees a flash of
 * the human theme
 */
export const AgentModeScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `try{if(localStorage.getItem(${JSON.stringify(
        STORAGE_KEY,
      )})==="on"){document.documentElement.setAttribute(${JSON.stringify(
        ATTRIBUTE,
      )},"on")}}catch(e){}`,
    }}
  />
);
