import Nav from "../components/Nav";
import { useLoaderData, Link, Form, useActionData } from "@remix-run/react";

import { json } from "@remix-run/node";
import { requireUserSession } from "~/sessions.server";
import connectDb from "~/db/connectDb.server";
import CantAccesThisPage from "../components/CantAccesThisPage";

export async function loader({ request }) {
  const session = await requireUserSession(request);
  const db = await connectDb();
  const url = new URL(request.url);
  // const trimUrl = url.substring(url.lastIndexOf("/") + 1);

  var id = await db.models.Profiles.find({
    userId: session.get("userId"),
  });
  var _id = id[0]._id;

  var courses = await db.models.Courses.find({ profileID: _id });
  var education = await db.models.Education.find({ profileID: _id });

  const Profile = await db.models.Profiles.find({
    userId: session.get("userId"),
  });
  return json({
    userId: session.get("userId"),
    Profile,
    url,
    courses,
    education,
  });
}

export default function Profile() {
  const { Profile, userId, courses, education } = useLoaderData();

  if (userId && Profile.length > 0) {
    var tagsArr = Profile[0].tags.split(",");
    return (
      <div>
        <Nav />
        <div className="flex content-around justify-around m-10">
          <div className="border-2 rounded p-10 w-9/12">
            <div className="flex content-around items-center justify-around ">
              <div className="px-5 w-5/12">
                <div className="flex content-around items-center align-items-center">
                  <img
                    src={Profile[0].profilePic}
                    alt="profile picture"
                    className="w-32 h-32 rounded-full mr-3"
                  />
                  <h1 className="ml-3 font-serif text-xl font-medium">
                    {Profile[0].name}
                  </h1>
                </div>

                <br />
                <h1>
                  <b className=" font-serif tracking-normal text-xl leading-loose">
                    Contacts:
                  </b>{" "}
                  <br />
                  <b className="font-serif">Email : </b>
                  {Profile[0].email}
                  <br />
                  {Profile[0].phone ? (
                    <span>
                      <b className="font-serif">Phone: </b> {Profile[0].phone}
                    </span>
                  ) : (
                    <br />
                  )}
                </h1>
                <br />
                <h1>
                  <b className="font-serif">Created at : </b>
                  {new Date(Profile[0].date).toLocaleDateString([], {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </h1>
              </div>
              <div className="w-5/12">
                <h1>{Profile[0].bio}</h1>
                <br />
                <div>
                  <div className="px-3 mt-3">
                    {Profile.tags ? (
                      <div>
                        <b className="font-serif">Competences : </b> <br />{" "}
                        <br />
                      </div>
                    ) : (
                      <br />
                    )}{" "}
                    {tagsArr.map((tag) => {
                      if (tag) {
                        return (
                          <span
                            key={tag}
                            className=" mx-2.5 my-5 px-3 py-1.5  bg-green-200 border-emerald-700 border-2 rounded-full leading-10"
                          >
                            {" "}
                            {tag + " "}
                          </span>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
            <br />
            {Profile[0].linkedIn || Profile[0].portfolio ? (
              <div className="flex  px-14 content-around items-center justify-around justify-items-center w-full">
                <br /> <br /> <br />
                <br />
                {Profile[0].linkedIn ? (
                  <div className="w-6/12 text-left">
                    <b className="font-serif ">LinkedIn </b>
                    <br />
                    <a href={Profile[0].linkedIn} className="text-blue-500">
                      {Profile[0].linkedIn}
                    </a>
                  </div>
                ) : (
                  <br />
                )}
                {Profile[0].portfolio ? (
                  <div className="w-6/12 text-left px-10">
                    <b className="font-serif ">Portfolio </b>
                    <br />
                    <a href={Profile[0].portfolio} className="text-blue-500">
                      {Profile[0].portfolio}
                    </a>
                  </div>
                ) : (
                  <br />
                )}
              </div>
            ) : (
              <br />
            )}

            <div className="flex content-evenly   justify-around justify-items-center">
              <div className="w-5/12">
                {education.length > 0 ? (
                  <div>
                    <div className="border-2 rounded w-full p-3">
                      <b className="font-serif ">Education </b>
                      <br />

                      <div>
                        {education.map((one) => {
                          var subjects = one.subjects.split(",");

                          return (
                            <div key={one.name}>
                              <br />
                              <div className="bg-slate-200 rounded px-3 py-5">
                                <h1 className="text-lg font-serif">
                                  {one.name + ", " + one.place}
                                </h1>
                                <br />
                                <div className="flex justify-between">
                                  <div className="w-6/12 mr-5">
                                    <span className=" font-serif">
                                      <b>Faculty: </b>
                                      {one.faculty}
                                    </span>{" "}
                                    <br /> <br />
                                    <b>Start </b>
                                    {new Date(one.start).toLocaleDateString(
                                      [],
                                      {
                                        year: "numeric",
                                        month: "numeric",
                                        day: "numeric",
                                      }
                                    )}{" "}
                                    <br />
                                    <b>End </b>
                                    {new Date(one.end).toLocaleDateString([], {
                                      year: "numeric",
                                      month: "numeric",
                                      day: "numeric",
                                    })}
                                  </div>
                                  <div className="w-6/12 ml-5">
                                    <b className="font-serif">Courses </b>

                                    <div>
                                      {subjects.map((subject) => {
                                        <h1> wtf</h1>;
                                        if (subject) {
                                          return <li>{subject}</li>;
                                        }
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <br />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <br /> <br />
                  </div>
                ) : (
                  <hr />
                )}
                <Link
                  to="/education"
                  className="text-bold text-xl text-green-800"
                >
                  <b>+ Add Education</b>
                </Link>
              </div>

              <div className="w-5/12">
                {courses.length > 0 ? (
                  <div>
                    <div className="border-2 rounded w-full p-3">
                      <b className="font-serif ">Extracurricular Courses </b>
                      <br />
                      <br />
                      <div>
                        {courses.map((course) => {
                          return (
                            <h1
                              key={course.name}
                              className="italic text-lg text-stone-600"
                            >
                              - {course.name}
                              <br />
                            </h1>
                          );
                        })}
                      </div>
                    </div>
                    <br /> <br />
                  </div>
                ) : (
                  <hr />
                )}
                <Link
                  to="/courses"
                  className="text-bold text-xl text-green-800"
                >
                  <b>+ Add Extracurricular courses</b>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <br />

        <span className="flex justify-evenly content-center">
          <Link
            to="/delete"
            className=" p-3 bg-red-600 rounded-2xl text-white text-bold text-xl"
          >
            Delete Profile
          </Link>
          <Link
            to="/update"
            className=" p-3 bg-green-800 rounded-2xl text-white text-bold text-xl"
          >
            Update Profile
          </Link>
        </span>
        <br />
      </div>
    );
  } else {
    return <CantAccesThisPage />;
  }
}
