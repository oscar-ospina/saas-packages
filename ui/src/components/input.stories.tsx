import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./input";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "centered" },
  args: { placeholder: "you@example.com" },
  render: (args) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true, value: "can't touch this" } };
export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "not-an-email" } };
