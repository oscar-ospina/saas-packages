import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its content", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Badge variant="destructive">Alert</Badge>);
    expect(screen.getByText("Alert")).toHaveClass("bg-destructive");
  });

  it("can render as a link via asChild", () => {
    render(
      <Badge asChild>
        <a href="/tag">link</a>
      </Badge>,
    );
    const link = screen.getByRole("link", { name: "link" });
    expect(link).toHaveAttribute("data-slot", "badge");
  });
});
