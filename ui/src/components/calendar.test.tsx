import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Calendar } from "./calendar";

// Fixed to the specimen's month (Febrero 2025) so assertions are deterministic.
const FEB_2025 = new Date(2025, 1);

describe("Calendar", () => {
  it("renders an accessible grid with the Spanish Monday-first header", () => {
    const { container } = render(<Calendar mode="single" month={FEB_2025} />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByText(/febrero 2025/i)).toBeInTheDocument();
    // RDP's weekday <th>s are hidden from the a11y tree — query the DOM.
    const weekdays = Array.from(container.querySelectorAll("th")).map((el) => el.textContent);
    expect(weekdays[0]).toMatch(/^lu/i); // Monday-first
  });

  it("selects a day on click", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar mode="single" month={FEB_2025} onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "viernes, 14 de febrero de 2025" }));
    expect(onSelect).toHaveBeenCalled();
    expect(onSelect.mock.calls[0][0]).toEqual(new Date(2025, 1, 14));
  });

  it("does not select disabled days", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Calendar
        mode="single"
        month={FEB_2025}
        disabled={{ before: new Date(2025, 1, 8) }}
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByRole("button", { name: "miércoles, 5 de febrero de 2025" }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("marks availability via the `available` modifier with the highlight roles", () => {
    render(
      <Calendar
        mode="single"
        month={FEB_2025}
        modifiers={{ available: [new Date(2025, 1, 10)] }}
      />,
    );
    const cell = screen.getByRole("button", { name: "lunes, 10 de febrero de 2025" }).closest("td");
    expect(cell?.className).toContain("bg-highlight");
  });
});
