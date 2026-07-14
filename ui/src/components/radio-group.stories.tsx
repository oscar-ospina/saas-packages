import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  parameters: { layout: "centered" },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The consultation-modality selector from the booking flow. */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="presencial" aria-label="Modalidad">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="presencial" id="rg-presencial" />
        <Label htmlFor="rg-presencial">Presencial</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="virtual" id="rg-virtual" />
        <Label htmlFor="rg-virtual">Virtual</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="telefono" id="rg-telefono" disabled />
        <Label htmlFor="rg-telefono">Teléfono (no disponible)</Label>
      </div>
    </RadioGroup>
  ),
};
