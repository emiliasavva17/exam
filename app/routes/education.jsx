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
    name: body.get("uniName"),
    faculty: body.get("faculty"),
    place: body.get("place"),
    subjects: body.get("courses"),
    start: body.get("start"),
    end: body.get("end"),
  };

  try {
    await db.models.Education.create(model);
    return redirect("/profile");
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(body) },
      { status: 400 }
    );
  }
}

export default function Education() {
  return (
    <div>
      <Nav />

      <div className="flex content-around justify-around m-10">
        <div className="border-2 rounded p-10 w-9/12 font-serif">
          <h1 className="text-xl font-bold text-center">Education </h1> <br />
          <Form method="post" className="p-10">
            <div>
              <div className="flex justify-between ">
                <label className="w-5/12 ">
                  University Name
                  <br />
                  <input
                    name="uniName"
                    type="text"
                    size="41"
                    placeholder="Busines Academy Aarhus"
                    className="my-3 px-5 w-full"
                  />
                  <br />
                </label>
                <label className="w-5/12 ">
                  What Faculty
                  <br />
                  <input
                    name="faculty"
                    type="text"
                    size="41"
                    placeholder="Web Development"
                    className="my-3 px-5 w-full"
                  />
                  <br />
                </label>
              </div>

              <div className="flex justify-between items-center ">
                <label className="w-5/12 ">
                  City,Country
                  <br />
                  <input
                    name="place"
                    type="text"
                    size="41"
                    placeholder="Aarhus, Denmark"
                    className="my-3 px-5 w-full"
                  />
                  <br />
                </label>

                <label className="w-5/12 ">
                  Courses <br />
                  <textarea
                    name="courses"
                    placeholder="PHP,PWA,AWP etc"
                    rows="4"
                    cols="40"
                    className="my-3 px-5  w-full"
                  />
                </label>
              </div>

              <div className="flex justify-between justify-items-start items-center ">
                <label className="w-5/12 ">
                  Study Start
                  <br />
                  <input
                    name="start"
                    type="date"
                    size="41"
                    className="my-3 px-5 w-full"
                  />
                  <br />
                </label>

                <label className="w-5/12 ">
                  Study End
                  <br />
                  <input
                    name="end"
                    type="date"
                    size="41"
                    className="my-3 px-5 w-full"
                  />
                  <br />
                </label>
              </div>
            </div>
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
