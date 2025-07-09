import * as React from "react";
import { Form, useActionData } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Card } from "~/components/ui/card";
import { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async () => {
    
  return {
    error: "this is the erro",
  };
};
export default function SignInPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>

        {actionData?.error && (
          <p className="text-red-500 text-center">{actionData.error}</p>
        )}

        <Form method="post" className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </Form>
      </Card>
    </div>
  );
}
