import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Calendar } from "./calendar";

const meta = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// The specimen's exact scenario (comp-calendar.html): Febrero 2025, the first
// week unavailable, seven bookable days highlighted, the 14th selected. Fixed
// dates keep the VR baseline deterministic.
const FEB_2025 = new Date(2025, 1);
const AVAILABLE = [10, 12, 17, 19, 21, 24, 26].map((d) => new Date(2025, 1, d));

export const Booking: Story = {
  parameters: { controls: { disable: true } },
  render: function BookingStory() {
    const [selected, setSelected] = React.useState<Date | undefined>(new Date(2025, 1, 14));
    return (
      <Calendar
        mode="single"
        month={FEB_2025}
        selected={selected}
        onSelect={setSelected}
        disabled={{ before: new Date(2025, 1, 8) }}
        modifiers={{ available: AVAILABLE }}
      />
    );
  },
};
