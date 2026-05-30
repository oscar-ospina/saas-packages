import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "./toast";

describe("Toast", () => {
  it("renders an open toast with its title and description", () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>All changes stored</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("All changes stored")).toBeInTheDocument();
  });
});
