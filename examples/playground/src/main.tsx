import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// @saas/ui's Figma fonts — consumers load them (the library only tokenizes the
// family). Self-hosted via @fontsource.
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "@fontsource-variable/archivo/index.css";
import "./styles.css";
import { App } from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
