import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

export interface SheetProps extends Omit<ComponentProps<"dialog">, "open"> {
  title: string;
  description: string;
}

export function Sheet({ className, ...props }: SheetProps) {
  return <dialog className={cn("vesper-sheet", className)} {...props} />;
}
