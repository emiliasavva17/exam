import { json, redirect } from "@remix-run/node";
import { Link, Form, useLoaderData } from "@remix-run/react";

import { requireUserSession } from "../sessions.server";
import Nav from "../components/Nav";
import connectDb from "~/db/connectDb.server";

export async function loader({ request, params }) {
  const session = await requireUserSession(request);
  const db = await connectDb();

  const Profile = await db.models.Users.findById(session.get("userId"));
  const isProfile = await db.models.Profiles.find({
    userId: session.get("userId"),
  });

  var id = await db.models.Profiles.find({
    userId: session.get("userId"),
  });
  var _id = id[0]._id;

  return json({ userId: session.get("userId"), _id });
}

export async function action({ request }) {
  const session = await requireUserSession(request);
  const body = await request.formData();
  const db = await connectDb();

  var id = await db.models.Profiles.find({
    userId: session.get("userId"),
  });
  var _id = id[0]._id;
  var model = {
    profileID: _id,
    name: body.get("course"),
  };

  try {
    await db.models.Courses.create(model);
    return redirect("/profile");
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(body) },
      { status: 400 }
    );
  }
}

export default function Courses() {
  return (
    <div>
      <Nav />
      <div className="flex content-around justify-around m-10">
        <div className="border-2 rounded p-10 w-9/12 font-serif">
          <h1 className="text-xl font-bold text-center">Courses </h1> <br />
          <Form method="post">
            <label>
              What Extracurricular Courses you attended?
              <br />
              <input
                name="course"
                type="text"
                placeholder="HTML + CSS kind of things"
                className="my-3 px-5 w-full"
              />
            </label>
            <br /> <br />
            <label className="text-center">
              Here could be the upload documnet but did't have time to impliment
              it 😢
              <br />
              technicaly i think i know how it can be done, <br />
              its similar to what we did last semester with PHP and SQL,
            </label>
            <br /> <br />
            <div className="flex justify-around content-around">
              <button
                type="submit"
                className="px-3 py-1.5 font-sans bg-emerald-800 text-white text-xl text-center mr-5 rounded-md hover:scale-105 hover:cursor-pointer duration-300 content-center transition-all "
              >
                Save
              </button>
            </div>
          </Form>
        </div>{" "}
      </div>
    </div>
  );
}
