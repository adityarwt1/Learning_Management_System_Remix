import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { cookieToken } from "~/utils/cookie.server";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const coookieheader = request.headers.get("Cookie");
  const user = await cookieToken.parse(coookieheader);
  return {
    coookieheader,
    user,
  };
};

export default function UserProfilePage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className="text-2xl font-semibold">
              {user.name
                .split(" ")
                .map((n: any) => n[0])
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

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">User ID</h3>
            <p className="text-sm font-mono p-2 bg-gray-100 rounded">
              {user._id}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-sm p-2 bg-gray-100 rounded">{user.email}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
            <p className="text-sm capitalize p-2 bg-gray-100 rounded">
              {user.role}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button variant="outline">Edit Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
