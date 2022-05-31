import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Form,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import styles from "~/tailwind.css";
import { requireUserSession } from "./sessions.server";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "Remix + MongoDB",
    viewport: "width=device-width,initial-scale=1",
  };
}
export async function loader({ request }) {
  // const session = await requireUserSession(request);
  // return json({ userId: session.get("userId") });
  return true;
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 text-slate-800 font-sans p-4">
        {/* <header className="pb-3 mb-4 border-b-2 flex justify-between px-9">
          <div>
            <Link to="/" className="hover:underline text-blue-600">
              Home
            </Link>
            <Link
              to="/books/new"
              className="ml-3 hover:underline text-blue-600"
            >
              New book
            </Link>
            <Link
              to="/login"
              className="ml-3 hover:underline text-emerald-800 text-align: left;"
            >
              Log In{" "}
            </Link>
          </div>
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="ml-3 hover:underline text-red-600 text-align: left;"
            >
              Log Out
            </button>
          </Form>
        </header> */}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
