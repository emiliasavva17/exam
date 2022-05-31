import { Link, useLoaderData, Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import { requireUserSession } from "~/sessions.server";
import connectDb from "~/db/connectDb.server";
import { getSession } from "~/sessions.server";
export async function loader({ request }) {
  const session = await requireUserSession(request);
  const db = await connectDb();
  const url = new URL(request.url);
  const trimUrl = url.substring(url.lastIndexOf("/") + 1);
  const session2 = await getSession(request.headers.get("Cookie"));

  const form = await request.formData();

  const user = await db.models.Users.findOne({
    _id: session.get("userId"),
    //  password: pwd,
  });

  const role = await db.models.Users.findById(session.get("userId"));
  // const Profile = await db.models.Profiles.find({
  //   userId: session.get("userId"),
  // });
  return json({ userId: session.get("userId"), url, role });
}
export default function Nav() {
  const { userId, url, role } = useLoaderData();
  //const trimUrl = url.substring(url.lastIndexOf("/") + 1);
  //Profile[0].profileAs
  // console.log(role[0].profileAs, userId, " nav");

  if (userId) {
    return (
      <header className="pb-3 mb-4 border-b-2 flex justify-between px-9 text-xl ">
        <div>
          <Link to="/" className="hover:underline text-blue-600">
            Home
          </Link>
        </div>

        <div className="flex">
          {!url ? (
            <Link
              to="/profile"
              className="underline text-xl px-3 "
              //style={{ color: `${trimUrl == "profile" ? "blue" : "red"}` }}
            >
              Profile
            </Link>
          ) : (
            <Link
              to="/delete"
              className="underline text-xl px-3 text-red-700"
              //style={{ color: `${trimUrl == "profile" ? "blue" : "red"}` }}
            >
              <b> Delete Profile </b>
            </Link>
          )}

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
          {/* <Link to="profile" className="underline text-xl px-3">
            Profile
          </Link> */}
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
