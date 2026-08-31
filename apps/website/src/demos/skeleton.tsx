"use client";

import { useEffect, useState } from "react";

import { Button } from "@tenstorrent/vesper/button";
import { Reset } from "@tenstorrent/vesper/icons";
import { Skeleton } from "@tenstorrent/vesper/skeleton";
import { Typography } from "@tenstorrent/vesper/typography";

interface SkeletonDemoProps {
  kind: "conditional" | "show" | "suspense";
}

export function SkeletonDemo(props: SkeletonDemoProps) {
  if (props.kind === "conditional") return <ConditionalSkeletonDemo />;
  if (props.kind === "show") return <ShowSkeletonDemo />;
  return null;
}

function ConditionalSkeletonDemo() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, [loading]);

  if (loading) return <Skeleton width={202} height={48} />;
  return (
    <Button size="lg" onClick={() => setLoading(true)} iconRight={<Reset />}>
      content loaded
    </Button>
  );
}

function ShowSkeletonDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <Skeleton show={loading}>
        <Typography variant="heading-md">hidden content</Typography>
      </Skeleton>
      <Button size="sm" onClick={() => setLoading(!loading)}>
        {loading ? "Set loading to false" : "Set loading to true"}
      </Button>
    </div>
  );
}
