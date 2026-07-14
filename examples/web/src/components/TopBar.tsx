import { ChevronRightIcon } from "lucide-react";
import { Button } from "@saas/ui";
import { Fragment } from "react";

import type { Step } from "../data";

const CRUMBS: [string, Step][] = [
  ["Home", "home"],
  ["Agenda tu cita", "agenda"],
  ["Pago", "pago"],
];

export function TopBar({ step, go }: { step: Step; go: (s: Step) => void }) {
  const idx = { home: 0, agenda: 1, pago: 2, confirm: 2 }[step];
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-100 bg-card px-10">
      <div className="flex items-center gap-5">
        <button type="button" onClick={() => go("home")} aria-label="Alta Vibración — inicio">
          <img className="h-[38px]" src="/brand/logo-horizontal.svg" alt="Alta Vibración" />
        </button>
        <nav
          aria-label="Progreso"
          className="flex items-center gap-2 text-[13px] font-semibold text-text-tertiary"
        >
          {CRUMBS.map(([label, key], i) => (
            <Fragment key={key}>
              {i > 0 && <ChevronRightIcon className="size-[15px] text-border-strong" />}
              <span className={i === idx ? "text-foreground" : ""}>{label}</span>
            </Fragment>
          ))}
        </nav>
      </div>
      <Button size="sm" onClick={() => go("agenda")}>
        Agenda tu cita
      </Button>
    </header>
  );
}
