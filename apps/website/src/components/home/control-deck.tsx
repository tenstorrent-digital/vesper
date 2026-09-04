"use client";

import { useEffect, useMemo, useState } from "react";

import { Admonition } from "@tenstorrent/vesper/admonition";
import { AvatarGroup } from "@tenstorrent/vesper/avatar-group";
import { Badge } from "@tenstorrent/vesper/badge";
import { Button } from "@tenstorrent/vesper/button";
import { Checkbox } from "@tenstorrent/vesper/checkbox";
import { Chip } from "@tenstorrent/vesper/chip";
import { Combobox } from "@tenstorrent/vesper/combobox";
import { Bolt, Reset, Wormhole } from "@tenstorrent/vesper/icons";
import { ProgressBar } from "@tenstorrent/vesper/progress-bar";
import { Range } from "@tenstorrent/vesper/range";
import { Select } from "@tenstorrent/vesper/select";
import { Slider } from "@tenstorrent/vesper/slider";
import { SplitButton } from "@tenstorrent/vesper/split-button";
import { StatusIndicator } from "@tenstorrent/vesper/status-indicator";
import { Switch } from "@tenstorrent/vesper/switch";
import { Tag } from "@tenstorrent/vesper/tag";
import { addToast } from "@tenstorrent/vesper/toast";
import { Toggle } from "@tenstorrent/vesper/toggle";
import { Tooltip } from "@tenstorrent/vesper/tooltip";
import { Typography } from "@tenstorrent/vesper/typography";

const DEVICES = ["n150", "n300", "p100a", "p150", "Galaxy"];

const KERNELS = [
  "matmul_bf16",
  "softmax_fused",
  "layernorm_rms",
  "flash_attention",
  "all_gather_ring",
];

/** the "temperature" the deck reports, derived from clock and power */
const temperature = (clock: number, power: number) =>
  Math.round(28 + clock * 0.55 + (power / 100) * 22);

const stateFor = (temp: number) =>
  temp > 92 ? "error" : temp > 78 ? "progress" : "ready";

/**
 * a working instrument panel built entirely out of Vesper
 *
 * this is the page's argument: every control here is a real component, wired
 * to real state, and the readout on the right responds to all of it. push the
 * clock and the power envelope far enough and the whole panel goes critical
 */
export const ControlDeck = () => {
  const [clock, setClock] = useState(62);
  const [envelope, setEnvelope] = useState<number[]>([20, 74]);
  const [device, setDevice] = useState<string | null>("n300");
  const [kernel, setKernel] = useState("matmul_bf16");
  const [mode, setMode] = useState("balanced");
  const [telemetry, setTelemetry] = useState(true);
  const [autotune, setAutotune] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [ticks, setTicks] = useState(0);

  const power = envelope[1] ?? 0;
  const temp = temperature(clock, power);
  const critical = temp > 92;

  /** throughput, invented but plausible, so the big number always moves */
  const throughput = useMemo(() => {
    const modeFactor = mode === "burst" ? 1.35 : mode === "quiet" ? 0.6 : 1;
    return Math.round(clock * 41 * modeFactor * (0.6 + power / 200));
  }, [clock, power, mode]);

  // a slow heartbeat, so the deck never looks completely frozen
  useEffect(() => {
    const interval = setInterval(() => setTicks((value) => value + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!critical) return;

    const toast = addToast({
      variant: "danger",
      timeout: 5000,
      content: "Thermal envelope exceeded. Backing off is also an option.",
    });

    return () => toast.dismiss();
  }, [critical]);

  const launch = () => {
    setLaunching(true);

    const loading = addToast({
      variant: "loading",
      content: `Dispatching ${kernel} to ${device ?? "no device"}…`,
    });

    setTimeout(() => {
      loading.update({
        variant: critical ? "warning" : "success",
        timeout: 6000,
        content: critical
          ? `${kernel} landed, but the fans are unhappy about it.`
          : `${kernel} landed on ${device ?? "nothing"} at ${throughput.toLocaleString()} TFLOP/s.`,
        action: {
          content: "Read the docs",
          altText: "Open the components overview",
          handler: () => {
            window.location.href = "/components";
          },
        },
      });
      setLaunching(false);
    }, 1400);
  };

  const reset = () => {
    setClock(62);
    setEnvelope([20, 74]);
    setMode("balanced");
    setDevice("n300");
    setKernel("matmul_bf16");
    setTelemetry(true);
    setAutotune(false);
  };

  return (
    <div className="panel deck" data-critical={critical || undefined}>
      <div className="deck-head">
        <Wormhole width={16} height={16} />
        <Typography as="span" variant="label-sm-mono" className="deck-title">
          vesper://control-deck
        </Typography>

        <span className="deck-head-end">
          <StatusIndicator
            state={stateFor(temp)}
            label={critical ? "critical" : launching ? "dispatching" : "idle"}
            animated={launching || critical}
          />
          <Tooltip content="Reset every control to its default">
            <Button
              size="xs"
              variant="ghost"
              iconLeft={<Reset />}
              onClick={reset}
            >
              Reset
            </Button>
          </Tooltip>
        </span>
      </div>

      <div className="deck-body">
        {/* ---------------------------------------------------- controls */}
        <div className="deck-column">
          <div className="deck-field">
            <Typography
              as="label"
              variant="label-xs-mono"
              className="deck-field-label"
            >
              Core clock
              <span className="deck-field-value">{clock}%</span>
            </Typography>
            <Slider
              value={clock}
              onValueChange={setClock}
              thumbAriaLabel="Core clock"
            />
          </div>

          <div className="deck-field">
            <Typography
              as="span"
              variant="label-xs-mono"
              className="deck-field-label"
            >
              Power envelope
              <span className="deck-field-value">
                {envelope[0]}–{envelope[1]}W
              </span>
            </Typography>
            <Range
              values={envelope}
              onValuesChange={setEnvelope}
              showTicks
              step={2}
              thumbAriaLabels={["Minimum power", "Maximum power"]}
            />
          </div>

          <div className="deck-field">
            <Typography
              as="span"
              variant="label-xs-mono"
              className="deck-field-label"
            >
              Scheduler
            </Typography>
            <Toggle
              value={mode}
              onValueChange={setMode}
              options={[
                { text: "Quiet", value: "quiet" },
                { text: "Balanced", value: "balanced" },
                { text: "Burst", value: "burst" },
              ]}
            />
          </div>

          <div className="deck-row">
            <Select
              aria-label="Target device"
              placeholder="Target device"
              options={DEVICES}
              value={device}
              onValueChange={setDevice}
              style={{ flex: 1, minWidth: "10rem" }}
            />
            <Combobox
              aria-label="Kernel"
              placeholder="Kernel…"
              options={KERNELS}
              value={kernel}
              onValueChange={(value) => setKernel(value || "matmul_bf16")}
              style={{ flex: 1, minWidth: "10rem" }}
            />
          </div>

          <div className="deck-row">
            <Switch
              label="Telemetry"
              size="sm"
              checked={telemetry}
              onChange={(event) => setTelemetry(event.target.checked)}
            />
            <Switch
              label="Autotune"
              size="sm"
              checked={autotune}
              onChange={(event) => setAutotune(event.target.checked)}
            />
            <Checkbox text="Trace kernels" size="sm" />
          </div>
        </div>

        {/* ----------------------------------------------------- readout */}
        <div className="deck-column">
          <div className="deck-gauge">
            <Typography
              as="span"
              variant="display-sm"
              className="deck-gauge-value"
            >
              {throughput.toLocaleString()}
            </Typography>
            <Typography
              as="span"
              variant="label-sm-mono"
              className="deck-gauge-unit"
            >
              TFLOP/s
            </Typography>
          </div>

          <div className="deck-field">
            <Typography
              as="span"
              variant="label-xs-mono"
              className="deck-field-label"
            >
              Utilisation
              <span className="deck-field-value">{clock}%</span>
            </Typography>
            <ProgressBar value={clock} animated aria-label="Utilisation" />
          </div>

          <div className="deck-field">
            <Typography
              as="span"
              variant="label-xs-mono"
              className="deck-field-label"
            >
              Die temperature
              <span className="deck-field-value">{temp}°C</span>
            </Typography>
            <ProgressBar
              value={Math.min(100, temp)}
              variant="steps"
              steps={12}
              animated
              aria-label="Die temperature"
            />
          </div>

          <div className="deck-row">
            <Badge variant={critical ? "danger" : "mint"}>
              {critical ? "throttling" : "nominal"}
            </Badge>
            <Badge variant="purple" subtle>
              {mode}
            </Badge>
            <Tag variant="accent-subtle">{device ?? "unassigned"}</Tag>
            <Tag variant="info-subtle">{kernel}</Tag>
            {telemetry && <Chip size="sm">telemetry on</Chip>}
            {autotune && <Chip size="sm">autotune</Chip>}
          </div>

          <div className="deck-row">
            <AvatarGroup
              avatars={[
                { src: undefined, alt: "Scheduler" },
                { src: undefined, alt: "Compiler" },
                { src: undefined, alt: "Runtime" },
                { src: undefined, alt: "Profiler" },
              ]}
            />
            <Typography
              as="span"
              variant="copy-xs"
              style={{ color: "var(--vesper-text-tertiary)" }}
            >
              4 services attached · {ticks * 2}s uptime
            </Typography>
          </div>

          <Admonition
            size="sm"
            variant={critical ? "danger" : autotune ? "info" : "success"}
          >
            {critical
              ? "Die temperature is past the envelope. Drop the clock or widen the power range."
              : autotune
                ? "Autotune is searching the kernel space. Results may shift between runs."
                : "This entire panel is Vesper components wired to React state. Nothing here is a picture."}
          </Admonition>
        </div>
      </div>

      <div className="deck-foot">
        <Button
          iconLeft={<Bolt />}
          disabled={launching}
          onClick={launch}
          variant={critical ? "danger" : "primary"}
        >
          {launching ? "Dispatching…" : "Dispatch kernel"}
        </Button>

        <SplitButton
          size="md"
          variant="subtle"
          menuItems={[
            {
              text: "Copy as JSON",
              description: "The current deck state",
              onSelect: () => {
                void navigator.clipboard.writeText(
                  JSON.stringify(
                    {
                      clock,
                      envelope,
                      device,
                      kernel,
                      mode,
                      telemetry,
                      autotune,
                    },
                    null,
                    2,
                  ),
                );
                addToast({
                  variant: "success",
                  timeout: 3000,
                  content: "Deck state copied to your clipboard.",
                });
              },
            },
            {
              text: "Push it to eleven",
              onSelect: () => {
                setClock(100);
                setEnvelope([60, 100]);
                setMode("burst");
              },
            },
            {
              text: "Reset",
              style: "danger",
              onSelect: reset,
            },
          ]}
          onClick={() =>
            addToast({
              variant: "default",
              timeout: 4000,
              content: "Snapshot saved. (Not really — this is a docs site.)",
            })
          }
        >
          Snapshot
        </SplitButton>

        <Typography
          as="span"
          variant="label-xs-mono"
          className="deck-foot-end"
          style={{ color: "var(--vesper-text-tertiary)" }}
        >
          14 components on this panel
        </Typography>
      </div>
    </div>
  );
};
