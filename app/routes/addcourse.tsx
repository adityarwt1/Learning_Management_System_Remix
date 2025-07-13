import { LoaderFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { connectDB } from "~/lib/mongodb";
import User from "~/models/User";
import { cookieToken } from "~/utils/cookie.server";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("cookie");
  const user = await cookieToken.parse(cookieHeader);

  if (!user) {
    return redirect("/signin");
  }
  if (user) {
    await connectDB();
    const userdata = await User.findOne({ email: user.email });
    return userdata;
  }
};

export default function AddCourse() {
  const user = useLoaderData<typeof loader>();
  console.log("loader data", user);
  return <div>Hello</div>;
}
