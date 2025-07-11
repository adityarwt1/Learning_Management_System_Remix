import { createCookie } from "@remix-run/node";

export const cookieToken = createCookie("_vote_lms", {
  maxAge: 60 * 60 * 24 * 7,
  sameSite: "lax",
  path: "/",
  httpOnly: true,
});
