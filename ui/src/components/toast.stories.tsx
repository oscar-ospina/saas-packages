import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";

function ToastDemo({
  variant,
  defaultOpen = false,
}: {
  variant?: "default" | "destructive";
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <ToastProvider>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Show toast
      </Button>
      <Toast variant={variant} open={open} onOpenChange={setOpen}>
        <div className="grid gap-1">
          <ToastTitle>Changes saved</ToastTitle>
          <ToastDescription>Your project settings were updated.</ToastDescription>
        </div>
        <ToastAction altText="Undo the change">Undo</ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

const meta = {
  title: "Components/Toast",
  component: ToastDemo,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: ["default", "destructive"] },
  },
} satisfies Meta<typeof ToastDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
export const Destructive: Story = { args: { variant: "destructive", defaultOpen: true } };
