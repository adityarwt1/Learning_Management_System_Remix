import { Form, useActionData } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Card } from "~/components/ui/card";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

import { ActionFunction, json, redirect } from "@remix-run/node";
import { connectDB } from "~/lib/mongodb";
import User from "~/models/User";
import bcrypt from "bcrypt";
import { cookieToken } from "~/utils/cookie.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  if (formData.has("_signup")) {
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const role = formData.get("role")?.toString();
    if (!name || !email || !password || !role) {
      return json({ error: "All fields are required." }, { status: 400 });
    }

    try {
      await connectDB();

      const existing = await User.findOne({ email });
      if (existing) {
        return json({ error: "Email already exists" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });

      await user.save();

      return redirect("/dashboard", {
        headers: {
          "Set-Cookie": await cookieToken.serialize(user),
        },
      });
    } catch (err) {
      console.log((err as Error).message);
      return json({ error: "Something went wrong" }, { status: 500 });
    }
  }

  return json({ error: "Invalid form action" }, { status: 400 });
};

export default function SignUpPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>

        {actionData?.error && (
          <p className="text-red-500 text-center">{actionData.error}</p>
        )}

        <Form method="post" className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div>
            <Label>Role</Label>
            <RadioGroup
              name="role"
              defaultValue="learner"
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instructor" id="instructor" />
                <Label htmlFor="instructor">Instructor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="learner" id="learner" />
                <Label htmlFor="learner">Learner</Label>
              </div>
            </RadioGroup>
          </div>
          <Button
            type="submit"
            name="_signup"
            value="signup"
            className="w-full"
          >
            Sign Up
          </Button>
        </Form>
      </Card>
    </div>
  );
}
