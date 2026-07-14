import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Chip } from "./chip";

describe("Chip", () => {
  it("exposes its toggle state via aria-pressed", () => {
    const { rerender } = render(<Chip>9:00 AM</Chip>);
    const chip = screen.getByRole("button", { name: "9:00 AM" });
    expect(chip).toHaveAttribute("aria-pressed", "false");
    rerender(<Chip selected>9:00 AM</Chip>);
    expect(chip).toHaveAttribute("aria-pressed", "true");
  });

  it("fires onClick so callers can control selection", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>10:00 AM</Chip>);
    await user.click(screen.getByRole("button", { name: "10:00 AM" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Chip disabled onClick={onClick}>
        11:00 AM
      </Chip>,
    );
    await user.click(screen.getByRole("button", { name: "11:00 AM" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
