import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./checkbox";
import { Label } from "./label";

describe("Checkbox", () => {
  it("toggles checked state on click", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Acepto las condiciones" />);
    const box = screen.getByRole("checkbox", { name: "Acepto las condiciones" });
    expect(box).not.toBeChecked();
    await user.click(box);
    expect(box).toBeChecked();
    await user.click(box);
    expect(box).not.toBeChecked();
  });

  it("is labelable via htmlFor and toggles from the label", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Checkbox id="news" />
        <Label htmlFor="news">Recibir novedades</Label>
      </>,
    );
    const box = screen.getByRole("checkbox", { name: "Recibir novedades" });
    await user.click(screen.getByText("Recibir novedades"));
    expect(box).toBeChecked();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox aria-label="Bloqueado" disabled onCheckedChange={onChange} />);
    await user.click(screen.getByRole("checkbox", { name: "Bloqueado" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
