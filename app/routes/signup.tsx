import * as React from "react";
import { Form, useActionData } from "@remix-run/react";
import { Input } from "app/components/ui/input";
import { Button } from "app/components/ui/button";
import { Label } from "app/components/ui/label";
import { Card } from "app/components/ui/card";
import { RadioGroup, RadioGroupItem } from "app/components/ui/radio-group";

export default function SignUpPage() {
  // If you want to handle errors, you can use useActionData here
  // const actionData = useActionData();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
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
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </Form>
      </Card>
    </div>
  );
}
