// Wire @testing-library/jest-dom matchers into Vitest's `expect`.
//
// We extend manually (rather than `import "@testing-library/jest-dom/vitest"`)
// so the `vitest` import resolves from this package even when jest-dom is hoisted
// to the workspace root, which the bare /vitest entry can't always resolve.
import { afterEach, expect } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

// `globals: false` means Testing Library's auto-cleanup (which hooks a global
// afterEach) never registers, so the DOM would accumulate across tests in a
// file. Register it explicitly.
afterEach(() => {
  cleanup();
});
