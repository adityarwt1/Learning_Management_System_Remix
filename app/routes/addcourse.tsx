import {
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
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
  return {
    user,
  };
};

export default function AddCourse() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <>
      <div>Hello</div>
      <div>Hello</div>
    </>
  );
}

export const meta: MetaFunction = () => {
  return [{ title: "Add Course" }];
};
