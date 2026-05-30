import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const Fruits = () => (
  <>
    <SelectTrigger className="w-56">
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
      </SelectGroup>
    </SelectContent>
  </>
);

export const Default: Story = {
  render: () => (
    <Select>
      <Fruits />
    </Select>
  ),
};

export const Open: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Select defaultOpen>
      <Fruits />
    </Select>
  ),
};
