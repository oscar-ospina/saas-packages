import * as React from "react";

import { cn } from "../lib/cn";

// Time-slot / selection chip from the "Selectors & chips" specimen
// (comp-selectors.html): 44px tall (= Input), 8px radius, Open Sans Bold 16/20
// with .1px tracking. A chip is a toggle — it renders a <button> with
// aria-pressed. Selected state uses the selection roles (AA divergence from the
// specimen's orange-400 + white text — figma-parity.md).
type ChipProps = React.ComponentProps<"button"> & {
  /** Toggle state — rendered as `aria-pressed` and the selected fill. */
  selected?: boolean;
};

function Chip({ className, selected = false, ...props }: ChipProps) {
  return (
    <button
      type="button"
      data-slot="chip"
      aria-pressed={selected}
      data-selected={selected || undefined}
      className={cn(
        "inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-lg border bg-card px-4 text-base font-bold tracking-[0.1px] text-foreground shadow-xs outline-none transition-all hover:border-border-strong focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[selected]:border-selected data-[selected]:bg-selected data-[selected]:text-selected-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Chip };
export type { ChipProps };
