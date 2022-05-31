import { Link, useLoaderData, Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import { requireUserSession } from "~/sessions.server";
import connectDb from "~/db/connectDb.server";
import { getSession } from "~/sessions.server";

export async function loader({ request }) {
  const session = await requireUserSession(request);
  const db = await connectDb();
  const url = new URL(request.url);

  const form = await request.formData();

  const user = await db.models.Users.findOne({
    _id: session.get("userId"),
  });

  const role = await db.models.Users.findById(session.get("userId"));

  return json({ userId: session.get("userId"), url, role });
}
export default function RecruiterNav() {
  const { userId, url, role } = useLoaderData();

  if (userId) {
    return (
      <header className="pb-3 mb-4 border-b-2 flex justify-between px-9 text-xl">
        <div>
          <Link to="/" className="hover:underline text-blue-600">
            Home
          </Link>
        </div>

        <div className="flex">
          <Link
            to=""
            className="underline text-xl px-3 font-bold "
            //style={{ color: `${trimUrl == "profile" ? "blue" : "red"}` }}
          >
            Saved
          </Link>

          <Form method="post" action="/logout">
            <button
              type="submit"
              className="ml-3 hover:underline text-red-600 text-align: left;"
            >
              Log Out
            </button>
          </Form>
        </div>
      </header>
    );
  } else {
    return (
      <header className="pb-3 mb-4 border-b-2 flex justify-between px-9 text-xl">
        <div>
          <Link to="/" className="hover:underline text-blue-600">
            Home
          </Link>
        </div>
        <div>
          <Link
            to=""
            className="underline text-xl px-3 font-bold "
            //style={{ color: `${trimUrl == "profile" ? "blue" : "red"}` }}
          >
            Saved
          </Link>
          <Link
            to="/login"
            className="ml-3 hover:underline text-emerald-800 text-align: left;"
          >
            Log In{" "}
          </Link>
        </div>
      </header>
    );
  }
}
