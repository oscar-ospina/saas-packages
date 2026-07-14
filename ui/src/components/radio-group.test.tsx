import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

function Modalidad() {
  return (
    <RadioGroup defaultValue="presencial" aria-label="Modalidad">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="presencial" id="presencial" />
        <Label htmlFor="presencial">Presencial</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="virtual" id="virtual" />
        <Label htmlFor="virtual">Virtual</Label>
      </div>
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("renders a radiogroup with the default value selected", () => {
    render(<Modalidad />);
    expect(screen.getByRole("radiogroup", { name: "Modalidad" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Presencial" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Virtual" })).not.toBeChecked();
  });

  it("selects another option on click (single selection)", async () => {
    const user = userEvent.setup();
    render(<Modalidad />);
    await user.click(screen.getByRole("radio", { name: "Virtual" }));
    expect(screen.getByRole("radio", { name: "Virtual" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Presencial" })).not.toBeChecked();
  });

  // Arrow-key roving isn't unit-testable: Radix filters focus candidates by
  // geometry (getClientRects), which jsdom doesn't implement. That behavior is
  // Radix's own guarantee; here we cover what the wrapper owns.
  it("selects the focused item with the keyboard (Space)", async () => {
    const user = userEvent.setup();
    render(<Modalidad />);
    const virtual = screen.getByRole("radio", { name: "Virtual" });
    virtual.focus();
    await user.keyboard(" ");
    expect(virtual).toBeChecked();
  });
});
