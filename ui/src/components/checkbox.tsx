import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { CheckIcon } from "lucide-react";

import { cn } from "../lib/cn";

// Aligned to the Figma "Selectors" specimen (comp-selectors.html): 22px control,
// unselected border = neutral-300 (border-strong role), selected = solid brand
// selection fill. AA divergence (figma-parity.md): the specimen fills with
// orange-400 (fails non-text 1.4.11), so checked state uses the selection roles
// (--color-selected / --color-selected-foreground).
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-[22px] shrink-0 rounded-sm border border-border-strong bg-card shadow-xs outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-selected data-[state=checked]:bg-selected data-[state=checked]:text-selected-foreground",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-items-center text-current"
      >
        <CheckIcon className="size-4" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
