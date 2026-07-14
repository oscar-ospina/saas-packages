import type { Meta, StoryObj } from "@storybook/react-vite";

// The invented second brand "Aurora" is wired into Storybook via
// .storybook/tailwind.css (`@import "../src/themes/aurora.css"`), the same place
// the DS theme is loaded. It defines `.theme-aurora*` purely as CSS-variable
// overrides — no change to tokens.css / semantic.css / components.
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  Input,
} from "../index";

// Literal class strings — Tailwind v4 only generates utilities it can see.
const ROLE_SWATCHES: { name: string; cls: string }[] = [
  { name: "primary", cls: "bg-primary" },
  { name: "primary-fg", cls: "bg-primary-foreground" },
  { name: "ring", cls: "bg-ring" },
  { name: "secondary", cls: "bg-secondary" },
  { name: "muted", cls: "bg-muted" },
  { name: "accent", cls: "bg-accent" },
  { name: "destructive", cls: "bg-destructive" },
  { name: "border", cls: "bg-border" },
];

/** The same real @saas/ui primitives, rendered identically in every column. */
function Showcase() {
  return (
    <div className="flex w-[300px] flex-col gap-5 rounded-xl border border-border bg-background p-5 text-foreground">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-muted-foreground">Button</p>
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-muted-foreground">Badge</p>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tu lectura numerológica</CardTitle>
          <CardDescription>Texto de apoyo de la tarjeta.</CardDescription>
        </CardHeader>
        <CardContent>
          <Field id="email" label="Correo electrónico">
            <Input type="email" placeholder="hola@correo.com" />
          </Field>
        </CardContent>
        <CardFooter>
          <Button size="sm">Continuar</Button>
        </CardFooter>
      </Card>

      <div className="flex flex-wrap gap-2">
        {ROLE_SWATCHES.map((s) => (
          <div key={s.name} className="flex flex-col items-center gap-1">
            <div className={`size-8 rounded-md border border-border ${s.cls}`} />
            <span className="text-[10px] text-muted-foreground">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Column({ label, sub, themeClass }: { label: string; sub: string; themeClass?: string }) {
  return (
    <div className={themeClass}>
      <div className="bg-background p-3">
        <p className="text-base font-bold text-foreground">{label}</p>
        <p className="mb-3 max-w-[300px] text-xs text-muted-foreground">{sub}</p>
        <Showcase />
      </div>
    </div>
  );
}

function ThemeCompare() {
  return (
    <div className="flex flex-wrap items-start gap-6 bg-white p-6">
      <Column label="Marca AV (default)" sub=":root — paleta cálida del DS (naranja + violeta)." />
      <Column
        label="Marca Aurora — solo roles"
        sub=".theme-aurora · re-skin COMPLETO solo con roles semánticos — Button incluido: su texto de énfasis/link y sus hovers ahora pasan por --color-emphasis/link/primary-hover/border-strong (el antiguo parche de tokens crudos ya no existe)."
        themeClass="theme-aurora"
      />
    </div>
  );
}

const meta: Meta = {
  title: "Foundations/Theming",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

/**
 * Side-by-side proof that @saas/ui re-skins to a second brand by overriding the
 * semantic-role CSS variables under a `.theme-*` scope — no component edits.
 * Button's former raw-token leak is closed (emphasis/link/hover roles), so the
 * role-only column is the complete re-skin.
 */
export const Compare: Story = {
  render: () => <ThemeCompare />,
};
