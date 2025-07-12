import {
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { cookieToken } from "~/utils/cookie.server";
import { connectDB } from "~/lib/mongodb";
import User from "~/models/User";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("cookie");
  const userData = await cookieToken.parse(cookieHeader);

  if (!userData) {
    return redirect("/signin");
  }

  await connectDB();
  const user = await User.findById(userData._id);

  if (!user) {
    return redirect("/signin");
  }

  if (user.role !== "instructor") {
    return redirect("/profile?message=instructor");
  }

  return { user };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.user) {
    return [{ title: "Add Course - LMS" }];
  }

  return [
    { title: `Add Course - ${data?.user?.name || "Instructor"} | LMS` },
    { name: "description", content: `Add a new course as ${data.user.name}` },
  ];
};

export default function AddCoursePage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Course</h1>
      <p>Welcome, {user.name}! You can add courses here.</p>
      {/* Add your course creation form here */}
    </div>
  );
}
