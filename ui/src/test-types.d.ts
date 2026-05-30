// Type-only: teach Vitest's `expect` about the jest-dom matchers
// (toBeInTheDocument, toHaveClass, toHaveAttribute, …).
//
// vitest@4's expect() returns @vitest/expect's `Assertion`, which extends its
// (empty) `Matchers<T>` extension point. jest-dom ships an augmentation for
// `declare module 'vitest'`, but that does NOT reach @vitest/expect's interface,
// so we augment Matchers directly here. The runtime `expect.extend(matchers)`
// lives in vitest.setup.ts.
import type * as JestDomMatchers from "@testing-library/jest-dom/matchers";

declare module "@vitest/expect" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- must match the upstream `Matchers<T = any>` signature to merge
  interface Matchers<T = any> extends JestDomMatchers.TestingLibraryMatchers<any, T> {}
}
