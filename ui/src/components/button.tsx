import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

// Aligned to the Figma "Button / States" + "Button / Size" matrix:
//   Type  → variant   State → :hover/:focus-visible/:disabled   Size → size
// Shared across all sizes (Figma): 8px radius, Open Sans SemiBold 18px text,
// 24px icons, 4px gap, hug (padding-based) sizing.
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg text-lg font-semibold outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
  {
    variants: {
      // Figma Button "Type". All styling goes through semantic roles (never raw
      // ramp tokens) so `.theme-*` scopes re-skin every variant: emphasis/link
      // text and the hover fills/borders map to the "Button emphasis roles" in
      // semantic.css (AV defaults: orange-900 / orange-700 / orange-200 /
      // neutral-300).
      variant: {
        // Type=Primary: primary fill (orange-300); Figma hover lightens (white
        // overlay). Figma's Focused state deepens the fill to orange-400, but
        // emphasis text on orange-400 is 3.77:1 (< AA) — so we diverge and let
        // the focus ring be the indicator (shadcn default). See figma-parity.md.
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover",
        // Type=Secondary: card surface + border + emphasis text; border
        // strengthens on hover.
        outline: "border bg-card text-emphasis shadow-xs hover:border-border-strong",
        // Type=Tertiary: text-only, accent hover wash.
        ghost: "text-emphasis hover:bg-accent",
        // No Figma Button "Type" (shadcn defaults) — destructive uses the Figma
        // Semantic/Red token; link uses the legible brand link role
        // (--color-primary/orange-300 is a fill-only wash, ~1.9:1 as text).
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        link: "text-link underline-offset-4 hover:underline",
      },
      // Figma Button "Size" — padding only (text/icon/radius are shared above).
      size: {
        sm: "px-2 py-1", // Figma Small  — padding 4×8
        default: "px-3 py-2", // Figma Medium — padding 8×12
        lg: "px-4 py-3", // Figma Large  — padding 12×16
        icon: "p-2", // square icon-only button (24px glyph)
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element instead of a `<button>`, merging props onto it. */
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
