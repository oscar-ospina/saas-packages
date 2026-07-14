import * as React from "react";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";

import { cn } from "../lib/cn";

// Aligned to the Figma "Calendar" specimen (comp-calendar.html): 300px card
// with 12px radius, Archivo month caption, 26px nav buttons, square 8px-radius
// day tiles. Spanish / Monday-first by default (the product is es-CO) — pass
// `locale` to override. Built on react-day-picker (accessible grid, keyboard
// nav, modifiers); selection uses the DS selection roles (AA divergence from
// the specimen's orange-400 + white — figma-parity.md), and the booking flow's
// "available" days are a modifier: `modifiers={{ available: [...dates] }}`
// renders the highlight roles (orange-50 wash + orange-700 text, AA as-is).
function Calendar({
  className,
  classNames,
  modifiersClassNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      data-slot="calendar"
      locale={es}
      showOutsideDays={showOutsideDays}
      modifiersClassNames={{
        // data-[selected] on the cell wins over these via attribute specificity.
        available: "bg-highlight font-semibold text-highlight-foreground",
        ...modifiersClassNames,
      }}
      classNames={{
        root: cn("w-[300px] rounded-xl border bg-card p-3.5 text-foreground", className),
        months: "relative flex flex-col",
        nav: "absolute right-0 top-0 flex gap-1.5",
        button_previous:
          "flex size-[26px] items-center justify-center rounded-md border border-input bg-card text-muted-foreground outline-none transition-shadow hover:border-border-strong focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        button_next:
          "flex size-[26px] items-center justify-center rounded-md border border-input bg-card text-muted-foreground outline-none transition-shadow hover:border-border-strong focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        chevron: "size-4 fill-current",
        month: "flex w-full flex-col",
        month_caption: "mb-2.5 flex h-[26px] items-center",
        caption_label: "font-display text-base font-semibold capitalize text-foreground",
        month_grid: "w-full border-collapse",
        weekdays: "mb-1 flex",
        weekday:
          "flex-1 select-none py-1 text-center text-[11px] font-semibold uppercase text-text-tertiary",
        week: "mt-0.5 flex gap-0.5",
        day: "group aspect-square flex-1 select-none rounded-lg p-0 text-center text-[13px] data-[disabled]:pointer-events-none data-[disabled]:text-text-tertiary data-[outside]:text-text-tertiary data-[selected]:bg-selected data-[selected]:font-semibold data-[selected]:text-selected-foreground data-[today]:font-semibold",
        day_button:
          "flex size-full cursor-pointer items-center justify-center rounded-lg outline-none transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-default group-data-[selected]:hover:bg-transparent",
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };
