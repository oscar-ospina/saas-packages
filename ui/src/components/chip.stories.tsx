import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Chip } from "./chip";

const meta = {
  title: "Components/Chip",
  component: Chip,
  parameters: { layout: "centered" },
  args: { children: "9:00 AM" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Disabled: Story = { args: { disabled: true } };

/** The time-slot picker row from the booking flow (Agenda). */
export const TimeSlots: Story = {
  parameters: { controls: { disable: true } },
  render: function TimeSlotsStory() {
    const slots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"];
    const [selected, setSelected] = React.useState("9:00 AM");
    return (
      <div className="flex flex-wrap gap-3">
        {slots.map((slot) => (
          <Chip key={slot} selected={selected === slot} onClick={() => setSelected(slot)}>
            {slot}
          </Chip>
        ))}
      </div>
    );
  },
};
