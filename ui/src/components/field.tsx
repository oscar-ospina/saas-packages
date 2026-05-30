import * as React from "react";

import { cn } from "../lib/cn";
import { Label } from "./label";

type ControlProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
};

type FieldProps = {
  /** id of the control; label `htmlFor` and hint/error ids derive from it. */
  id: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  className?: string;
  /** A single form control (e.g. `<Input />`). Gets id + aria-* injected. */
  children: React.ReactElement<ControlProps>;
};

/**
 * Accessible form-field wrapper: renders a label, the control, and a hint or
 * error, and wires `aria-describedby` / `aria-invalid` / `aria-required` onto
 * the control automatically.
 */
function Field({ id, label, hint, error, required, className, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [children.props["aria-describedby"], errorId, hintId].filter(Boolean).join(" ") || undefined;

  const control = React.cloneElement(children, {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : children.props["aria-invalid"],
    "aria-required": required ?? children.props["aria-required"],
  });

  return (
    <div data-slot="field" className={cn("grid gap-2", className)}>
      {label ? (
        <Label htmlFor={id}>
          {label}
          {required ? (
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
          ) : null}
        </Label>
      ) : null}
      {control}
      {hint && !error ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Field };
export type { FieldProps };
