import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type {
  LinksFunction,
  LoaderFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";

import "./tailwind.css";
import { Navbar } from "./components/Navbar";
import { cookieToken } from "./utils/cookie.server";
import { Toaster } from "sonner";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    const user = await cookieToken.parse(cookieHeader);
    return {
      isAuthenticated: !!user,
      user: user || null,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
    };
  }
};

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();

  // Add fallback values to prevent undefined errors
  const isAuthenticated = loaderData?.isAuthenticated ?? false;
  const user = loaderData?.user ?? null;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="w-full">
        <Navbar isAuthenticated={isAuthenticated} />
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
