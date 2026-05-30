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
      // Figma Button "Type". All three use orange-900 (#782516) text; hover/focus
      // follow Figma's State variants. The button text color is orange-900
      // across types (= primary-foreground).
      variant: {
        // Type=Primary: orange-300 fill; Figma hover lightens (white overlay),
        // focus deepens to orange-400.
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-orange-200 focus-visible:bg-orange-400",
        // Type=Secondary: white surface + neutral border + orange text; border
        // darkens on hover.
        outline: "border bg-card text-orange-900 shadow-xs hover:border-neutral-300",
        // Type=Tertiary: text-only, neutral-100 hover wash.
        ghost: "text-orange-900 hover:bg-accent",
        // No Figma Button "Type" (shadcn defaults) — destructive uses the Figma
        // Semantic/Red token, link a legible brand orange (orange-700, 5.84:1;
        // --color-primary/orange-300 is a fill-only wash, ~1.9:1 as text).
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        link: "text-orange-700 underline-offset-4 hover:underline",
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
