import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Field } from "./field";
import { Input } from "./input";

describe("Field", () => {
  it("associates the label with the control", () => {
    render(
      <Field id="name" label="Name">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("links a hint via aria-describedby", () => {
    render(
      <Field id="email" label="Email" hint="Be careful">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-describedby", "email-hint");
    expect(screen.getByText("Be careful")).toHaveAttribute("id", "email-hint");
  });

  it("marks the control invalid and links the error message", () => {
    render(
      <Field id="email" label="Email" error="Bad email">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Bad email");
  });

  it("sets aria-required when required", () => {
    render(
      <Field id="email" label="Email" required>
        <Input />
      </Field>,
    );
    // The required marker (*) is aria-hidden, so the accessible name stays "Email".
    expect(screen.getByRole("textbox", { name: /email/i })).toHaveAttribute(
      "aria-required",
      "true",
    );
  });
});
