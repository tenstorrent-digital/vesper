import Link from "next/link";

import { Button } from "@tenstorrent/vesper/button";
import { ArrowRight } from "@tenstorrent/vesper/icons";
import { Typography } from "@tenstorrent/vesper/typography";

const RAMP = [
  { variant: "display-md", label: "display-md" },
  { variant: "heading-2xl", label: "heading-2xl" },
  { variant: "heading-lg", label: "heading-lg" },
  { variant: "heading-sm", label: "heading-sm" },
  { variant: "copy-lg", label: "copy-lg" },
  { variant: "copy-md", label: "copy-md" },
  { variant: "label-sm-mono", label: "label-sm-mono" },
] as const;

/** the brand ramps, straight from the primitive colour tokens */
const RAMPS = ["purple", "mint", "teal", "pink", "yellow", "stone"] as const;

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

/**
 * the type ramp and the colour ramps, side by side
 *
 * both are rendered straight from tokens — the swatches are literally
 * `var(--vesper-purple-300)` and friends, so this section is always in sync
 * with whatever the design system currently ships
 */
export const Specimen = () => (
  <div className="specimen">
    <div className="panel type-ramp">
      {RAMP.map(({ variant, label }) => (
        <div key={label} className="type-ramp-row">
          <Typography
            as="span"
            variant="label-xs-mono"
            className="type-ramp-name"
          >
            {label}
          </Typography>
          <Typography as="span" variant={variant} className="type-ramp-sample">
            Compute is a design problem
          </Typography>
        </div>
      ))}

      <Button
        as={Link}
        href="/components/typography"
        size="xs"
        variant="ghost"
        iconRight={<ArrowRight />}
        style={{
          alignSelf: "flex-start",
          marginTop: "var(--vesper-spacing-2)",
        }}
      >
        All 32 variants
      </Button>
    </div>

    <div className="panel swatches">
      {RAMPS.map((ramp) => (
        <div key={ramp}>
          <Typography
            as="div"
            variant="label-xs-mono"
            style={{
              color: "var(--vesper-text-tertiary)",
              marginBottom: "var(--vesper-spacing-1)",
            }}
          >
            {ramp}
          </Typography>
          <div className="swatch-row">
            {STEPS.map((step) => (
              <div
                key={step}
                className="swatch"
                title={`--vesper-${ramp}-${step}`}
                style={{ background: `var(--vesper-${ramp}-${step})` }}
              />
            ))}
          </div>
        </div>
      ))}

      <Button
        as={Link}
        href="/tokens"
        size="xs"
        variant="ghost"
        iconRight={<ArrowRight />}
        style={{ alignSelf: "flex-start" }}
      >
        Every token
      </Button>
    </div>
  </div>
);
