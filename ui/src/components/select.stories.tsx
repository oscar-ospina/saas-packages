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

// Accessible usage: a combobox needs a name from a label, not from its
// placeholder (the placeholder is the value display). Wired via aria-labelledby
// to a visible label — the pattern consumers should follow.
export const WithLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid gap-2">
      <span id="fruit-label" className="text-sm font-medium">
        Fruit
      </span>
      <Select>
        <SelectTrigger className="w-56" aria-labelledby="fruit-label">
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
      </Select>
    </div>
  ),
};
