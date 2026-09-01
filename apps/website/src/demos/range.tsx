"use client";

import { useState } from "react";

import { Button } from "@tenstorrent/vesper/button";
import { Range } from "@tenstorrent/vesper/range";
import { Typography } from "@tenstorrent/vesper/typography";

const PRICE_THUMB_LABELS = ["Price (min)", "Price (max)"];

interface RangeDemoProps {
  kind: "controlled" | "form" | "custom-thumb-labels";
}

export function RangeDemo(props: RangeDemoProps) {
  if (props.kind === "controlled") {
    return <ControlledRangeDemo />;
  }

  if (props.kind === "form") {
    return <FormRangeDemo />;
  }

  if (props.kind === "custom-thumb-labels") {
    return <CustomThumbLabelsRangeDemo />;
  }

  return null;
}

function ControlledRangeDemo() {
  const [price, setPrice] = useState([25, 75]);

  return (
    <div className="gap-vesper-4 flex flex-col">
      <Range
        aria-label="Price"
        values={price}
        onValuesChange={setPrice}
        thumbAriaLabels={PRICE_THUMB_LABELS}
      />
      <Typography variant="copy-sm">
        Selected values: {price.join(", ")}
      </Typography>
      <Button size="sm" onClick={() => setPrice([0, 100])}>
        Reset
      </Button>
    </div>
  );
}

function FormRangeDemo() {
  const [submitted, setSubmitted] = useState<string[] | null>(null);

  return (
    <form
      className="gap-vesper-4 flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmitted(data.getAll("price").map(String));
      }}
    >
      <Range
        name="price"
        aria-label="Price"
        defaultValues={[20, 80]}
        thumbAriaLabels={PRICE_THUMB_LABELS}
      />
      <Button size="sm" type="submit">
        Submit
      </Button>
      {submitted !== null && (
        <Typography variant="copy-sm">
          Submitted values: {submitted.join(", ")}
        </Typography>
      )}
    </form>
  );
}

function CustomThumbLabelsRangeDemo() {
  const [price, setPrice] = useState([30, 70]);

  return (
    <Range
      aria-label="Price"
      showValueLabels
      values={price}
      onValuesChange={setPrice}
      valueLabels={price.map((value) => `$${value}`)}
      thumbAriaLabels={["Price (min)", "Price (max)"]}
    />
  );
}
