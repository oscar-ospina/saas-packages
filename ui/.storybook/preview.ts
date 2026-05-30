import type { Preview } from "@storybook/react-vite";
import "./tailwind.css";

const preview: Preview = {
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
