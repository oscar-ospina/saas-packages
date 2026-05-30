import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Input } from "./input";

describe("Input", () => {
  it("accepts typed text", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="email" />);
    const input = screen.getByLabelText("email");
    await user.type(input, "hi@example.com");
    expect(input).toHaveValue("hi@example.com");
  });

  it("is disabled when the disabled prop is set", () => {
    render(<Input aria-label="email" disabled />);
    expect(screen.getByLabelText("email")).toBeDisabled();
  });

  it("reflects aria-invalid", () => {
    render(<Input aria-label="email" aria-invalid />);
    expect(screen.getByLabelText("email")).toHaveAttribute("aria-invalid", "true");
  });
});
