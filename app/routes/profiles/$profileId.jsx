import { useLoaderData, useCatch, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import Nav from "../../components/Nav";
import connectDb from "~/db/connectDb.server.js";
import RecruiterNav from "../../components/RecruiterNav";
import { requireUserSession } from "~/sessions.server";

export async function loader({ params, request }) {
  const db = await connectDb();
  const session = await requireUserSession(request);
  const url = new URL(request.url);
  var x = url.toString();
  const trimUrl = x.substring(x.lastIndexOf("/") + 1);

  const Profile = await db.models.Profiles.findById(params.profileId);
  const role = await db.models.Users.find({ _id: session.get("userId") });

  var courses = await db.models.Courses.find({ profileID: trimUrl });
  var education = await db.models.Education.find({ profileID: trimUrl });

  if (!Profile) {
    throw new Response(`Couldn't find book with id ${params.profileId}`, {
      status: 404,
    });
  }
  return json({
    userId: session.get("userId"),
    Profile,
    role,
    education,
    courses,
  });
}

export default function ProfilePage() {
  const { Profile, courses, education } = useLoaderData();
  const { role } = useLoaderData();
  console.log(education);
  var tagsArr = Profile.tags.split(",");
  return (
    <div>
      <div>{!role[0].profileAs ? <Nav /> : <RecruiterNav />}</div>

      <div className="flex content-around justify-around m-10">
        <div className="border-2 rounded px-10 py-16 w-9/12">
          <div className="flex content-around  items-center justify-around ">
            <div className="px-5 w-5/12 ">
              <div className="flex content-around  items-center align-items-center">
                <img
                  src={Profile.profilePic}
                  alt="profile picture"
                  className="w-32 h-32 rounded-full mr-3"
                />
                <h1 className="ml-3 font-serif text-xl font-medium">
                  {Profile.name}
                </h1>
              </div>

              <br />
              <h1>
                <b className=" font-serif tracking-normal text-xl leading-loose">
                  Contacts:
                </b>{" "}
                <br />
                <b className="font-serif">Email : </b>
                {Profile.email}
                <br />
                {Profile.phone ? (
                  <span>
                    <b className="font-serif">Phone: </b> {Profile.phone}
                  </span>
                ) : (
                  <br />
                )}
              </h1>
              <br />
              <h1>
                <b className="font-serif">Created at : </b>
                {new Date(Profile.date).toLocaleDateString([], {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h1>
            </div>
            <div className="w-5/12">
              <h1>{Profile.bio}</h1>
              <br />
              <div>
                <div className="px-3 mt-3">
                  {Profile.tags ? (
                    <div>
                      <b className="font-serif">Competences : </b> <br /> <br />
                    </div>
                  ) : (
                    <br />
                  )}
                  {tagsArr.map((tag) => {
                    if (tag) {
                      return (
                        <span
                          key={tag}
                          className=" mx-2.5 px-3 py-2  bg-green-200 border-emerald-700 border-2 rounded-full leading-10"
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
          <br />{" "}
          {Profile.linkedIn || Profile.portfolio ? (
            <div className="flex  px-14 content-around items-center justify-around justify-items-center w-full">
              <br /> <br /> <br />
              {Profile.linkedIn ? (
                <div className="w-6/12 text-left">
                  <b className="font-serif ">LinkedIn </b>
                  <br />
                  <a href={Profile.linkedIn} className="text-blue-500">
                    {Profile.linkedIn}
                  </a>
                </div>
              ) : (
                <br />
              )}
              {Profile.portfolio ? (
                <div className="w-6/12 text-left px-10">
                  <b className="font-serif ">Portfolio </b>
                  <br />
                  <a href={Profile.portfolio} className="text-blue-500">
                    {Profile.portfolio}
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
                        //console.log(subjects, "subjects");
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
                                  {new Date(one.start).toLocaleDateString([], {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                  })}{" "}
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
                                      // console.log(subject, "if");

                                      console.log(subject, "if");
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
              <Link to="/courses" className="text-bold text-xl text-green-800">
                <b>+ Add Extracurricular courses</b>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <br />
    </div>
  );
  //   console.log(profile);
  //   return (
  //     <div>
  //       <h1 className="text-2xl font-bold mb-4">{profile.name}</h1>
  //       test 1111
  //     </div>
  //   );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <h2>{caught.data}</h2>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <h1 className="text-red-500 font-bold">
      {error.name}: {error.message}
    </h1>
  );
}
