import * as React from "react";
import type { Preview } from "@storybook/react-vite";
// Figma fonts (Body = Open Sans, Display = Archivo). Self-hosted so Storybook +
// VR are deterministic offline. Consumers load these themselves (see README).
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "@fontsource-variable/archivo/index.css";
import "./tailwind.css";

const preview: Preview = {
  // Storybook's preview defaults the body to Nunito Sans; wrap every story in
  // the Figma body font so the canvas + VR baselines render in Open Sans (the
  // inline var is cascade-proof, unlike a body rule Storybook overrides).
  decorators: [
    (Story) =>
      React.createElement(
        "div",
        { style: { fontFamily: "var(--font-sans)" } },
        React.createElement(Story),
      ),
  ],
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: {
      // Surface axe violations in the a11y panel; promoted to test failures
      // once the Vitest addon lands with the primitives.
      test: "todo",
    },
  },
};

export default preview;
