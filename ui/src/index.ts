// Public API for @saas/ui.
//
// Token surface (CSS) is shipped separately and imported by consumers:
//   @import "@saas/ui/theme.css";
//
// Component primitives are added under ./components and re-exported here as
// they land (Button, Input, Select, Card, Dialog, Toast, Avatar, Badge).

export { cn } from "./lib/cn";
export type { ClassValue } from "clsx";

export { Button, buttonVariants } from "./components/button";
export type { ButtonProps } from "./components/button";

export { Badge, badgeVariants } from "./components/badge";
export type { BadgeProps } from "./components/badge";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "./components/card";

export { Input } from "./components/input";
export { Label } from "./components/label";
export { Field } from "./components/field";
export type { FieldProps } from "./components/field";
