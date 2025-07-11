import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { cookieToken } from "~/utils/cookie.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  console.log("consoled the whole request", request);
  const token = await cookieToken.parse(cookieHeader);

  if (!token) {
    return redirect("/signin");
  }

  return json({ message: "Welcome back!" });
}
