import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const coookieheader = await request.headers.get("Cookie");
  console.log(request);
  return {
    coookieheader,
  };
};
