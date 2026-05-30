// Wire @testing-library/jest-dom matchers into Vitest's `expect`.
//
// We extend manually (rather than `import "@testing-library/jest-dom/vitest"`)
// so the `vitest` import resolves from this package even when jest-dom is hoisted
// to the workspace root, which the bare /vitest entry can't always resolve.
import { expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
