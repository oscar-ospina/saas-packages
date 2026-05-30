import type { Meta, StoryObj } from "@storybook/react-vite";

// Static, fully-spelled class strings — Tailwind v4 only generates utilities it
// can see as literal substrings; `bg-${name}` would never be generated.
const SWATCHES: { name: string; cls: string }[] = [
  { name: "background", cls: "bg-background" },
  { name: "foreground", cls: "bg-foreground" },
  { name: "primary", cls: "bg-primary" },
  { name: "primary-foreground", cls: "bg-primary-foreground" },
  { name: "secondary", cls: "bg-secondary" },
  { name: "muted", cls: "bg-muted" },
  { name: "muted-foreground", cls: "bg-muted-foreground" },
  { name: "accent", cls: "bg-accent" },
  { name: "destructive", cls: "bg-destructive" },
  { name: "border", cls: "bg-border" },
];

const TYPE: { label: string; cls: string }[] = [
  { label: "Header / H1 Bold", cls: "text-header-h1-bold" },
  { label: "Header / H3 Medium", cls: "text-header-h3-medium" },
  { label: "Title / Large", cls: "text-title-title-large" },
  {
    label: "Body / B1 Regular — the quick brown fox jumps over the lazy dog",
    cls: "text-body-b1-regular",
  },
  { label: "Body / B3 Regular", cls: "text-body-b3-regular" },
];

function TokenShowcase() {
  return (
    <div className="space-y-10 p-8">
      <section>
        <h2 className="mb-4 text-header-h3-medium">Color tokens (provisional semantic layer)</h2>
        <div className="flex flex-wrap gap-5">
          {SWATCHES.map(({ name, cls }) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div className={`size-16 rounded-lg border border-border ${cls}`} />
              <span className="text-body-b3-regular text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-header-h3-medium">Typography tokens (from Figma)</h2>
        {TYPE.map(({ label, cls }) => (
          <p key={cls} className={cls}>
            {label}
          </p>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-header-h3-medium">Radius scale</h2>
        <div className="flex items-end gap-4">
          <div className="size-16 rounded-sm bg-secondary" />
          <div className="size-16 rounded-md bg-secondary" />
          <div className="size-16 rounded-lg bg-secondary" />
          <div className="size-16 rounded-xl bg-secondary" />
        </div>
      </section>
    </div>
  );
}

const meta = {
  title: "Foundations/Tokens",
  component: TokenShowcase,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TokenShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tokens: Story = {};
