import * as React from "react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@saas/ui";

export function App() {
  const [saved, setSaved] = React.useState(false);

  return (
    <ToastProvider>
      <main className="flex min-h-svh items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Team settings</CardTitle>
            <CardDescription>Manage the member profile and access role.</CardDescription>
            <CardAction>
              <Badge>Pro</Badge>
            </CardAction>
          </CardHeader>

          <CardContent className="grid gap-5">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>OO</AvatarFallback>
              </Avatar>
              <div className="grid">
                <span className="text-sm font-medium">Oscar Ospina</span>
                <span className="text-sm text-muted-foreground">owner</span>
              </div>
            </div>

            <Field id="email" label="Email" hint="Used for sign-in and notifications.">
              <Input type="email" defaultValue="oscar@example.com" />
            </Field>

            <Field id="role" label="Role">
              <Select defaultValue="admin">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </CardContent>

          <CardFooter className="justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-destructive">
                  Remove
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Remove member?</DialogTitle>
                  <DialogDescription>
                    This revokes their access immediately. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive">Remove</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button onClick={() => setSaved(true)}>Save changes</Button>
          </CardFooter>
        </Card>
      </main>

      <Toast open={saved} onOpenChange={setSaved}>
        <div className="grid gap-1">
          <ToastTitle>Settings saved</ToastTitle>
          <ToastDescription>Your changes have been applied.</ToastDescription>
        </div>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}
