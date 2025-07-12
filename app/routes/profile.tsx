import {
  LoaderFunction,
  LoaderFunctionArgs,
  ActionFunction,
  json,
  redirect,
} from "@remix-run/node";
import { cookieToken } from "~/utils/cookie.server";
import { connectDB } from "~/lib/mongodb";
import User from "~/models/User";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useLoaderData, useFetcher, useNavigation } from "@remix-run/react";
import { Link } from "@remix-run/react";

type ActionData = {
  error?: string;
  success?: boolean;
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const userData = await cookieToken.parse(cookieHeader);

  if (!userData) {
    return redirect("/signin");
  }

  await connectDB();
  const user = await User.findById(userData._id);

  if (!user) {
    return redirect("/signin");
  }

  return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const userData = await cookieToken.parse(cookieHeader);

  if (!userData) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();

  if (!name || !email) {
    return json({ error: "Name and email are required" }, { status: 400 });
  }

  try {
    await connectDB();
    await User.findByIdAndUpdate(userData._id, { name, email });
    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to update profile" }, { status: 500 });
  }
};

export default function UserProfilePage() {
  const { user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.profilePicture || ""} alt={user.name} />
            <AvatarFallback className="text-2xl font-semibold">
              {user.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <Badge
              variant={user.role === "learner" ? "default" : "secondary"}
              className="mt-2"
            >
              {user.role}
            </Badge>
          </div>
        </CardHeader>

        <fetcher.Form method="post">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">User ID</h3>
              <p className="text-sm font-mono p-2 bg-gray-100 rounded">
                {user._id}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Account Type
              </h3>
              <p className="text-sm capitalize p-2 bg-gray-100 rounded">
                {user.role}
              </p>
            </div>

            {fetcher.data?.error && (
              <p className="text-red-500 text-sm">{fetcher.data.error}</p>
            )}
            {fetcher.data?.success && (
              <p className="text-green-500 text-sm">
                Profile updated successfully!
              </p>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button asChild variant="ghost">
              <Link to="/">Back to Home</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </fetcher.Form>
      </Card>
    </div>
  );
}
