import type { Meta, StoryObj } from "@storybook/react-vite";

import { Field } from "./field";
import { Input } from "./input";

const meta = {
  title: "Components/Field",
  component: Field,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithHint: Story = {
  args: {
    id: "email-hint-demo",
    label: "Email",
    hint: "We'll never share your email.",
    children: <Input type="email" placeholder="you@example.com" />,
  },
};

export const WithError: Story = {
  args: {
    id: "email-error-demo",
    label: "Email",
    required: true,
    error: "Enter a valid email address.",
    children: <Input type="email" defaultValue="not-an-email" />,
  },
};
