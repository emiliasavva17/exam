import { Link, Form, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import { requireUserSession } from "../sessions.server";
import { getSession, destroySession } from "~/sessions.server";

import Nav from "../components/Nav";

export async function loader({ request, params }) {
  const session = await requireUserSession(request);
  const db = await connectDb();

  const Profile = await db.models.Users.findById(session.get("userId"));
  const isProfile = await db.models.Profiles.find({
    userId: session.get("userId"),
  });
  return json({ userId: session.get("userId"), Profile, isProfile });
}
export async function action({ request }) {
  const session = await requireUserSession(request);
  const session2 = await getSession(request.headers.get("Cookie"));

  const body = await request.formData();
  const db = await connectDb();

  var id = await db.models.Profiles.find({
    userId: session.get("userId"),
  });
  var action = body.get("action");

  if (action == "delete") {
    db.models.Profiles.findByIdAndDelete(id).exec();
    db.models.Users.findByIdAndDelete(session.get("userId")).exec();
    console.log("delete was togled");

    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session2),
      },
    });
  } else alert("You cant delete this item");
}
export default function Delete() {
  return (
    <div>
      <Nav />
      <div className="flex content-around justify-around m-10 h-64 items-center ">
        {/* <div className="flex content-around justify-around m-10 h-64 items-center"> */}
        <div>
          <h1 className=" text-xl font-bold ">
            Are you sure that you that you what to delete your profile?
          </h1>
          <div className="flex mt-10 content-around justify-around items-center">
            <Link
              to="/profile"
              className="mx-5 p-3 px-4 text-xl bg-green-800 text-white rounded-3xl"
            >
              Go back to Profile
            </Link>
            <Form method="post">
              <button
                type="submit"
                name="action"
                value="delete"
                className="mx-5 p-3 px-4 bg-red-600 text-white rounded-3xl text-xl"
              >
                Delete
              </button>
            </Form>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
