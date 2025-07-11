import * as React from "react";
import { Form, useActionData } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Card } from "~/components/ui/card";
import { ActionFunction } from "@remix-run/node";
import User from "~/models/User";
import bcrypt from "bcrypt";
import { cookieToken } from "~/utils/cookie.server";
import { redirect, json } from "@remix-run/node";
import { connectDB } from "~/lib/mongodb";

export const action: ActionFunction = async ({ request }) => {
  const formdata = await request.formData();
  if (formdata.has("signin")) {
    const email = formdata.get("email")?.toString();
    const password = formdata.get("password")?.toString();

    if (!email || !password) {
      return json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return json({ error: "Invalid email or password." }, { status: 400 });
    }

    const isPasswordTrue = await bcrypt.compare(password, user.password);
    if (!isPasswordTrue) {
      return json({ error: "Invalid email or password." }, { status: 400 });
    }

    // Success: set cookie and redirect
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await cookieToken.serialize(user),
      },
    });
  }
  return json({ error: "Invalid form action." }, { status: 400 });
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
          <Button type="submit" name="signin" className="w-full">
            Sign In
          </Button>
        </Form>
      </Card>
    </div>
  );
}
