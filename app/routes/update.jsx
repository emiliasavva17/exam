import { Link, Form, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import { requireUserSession } from "../sessions.server";
import Nav from "../components/Nav";

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

  var courses = await db.models.Courses.find({ profileID: _id });
  var education = await db.models.Education.find({ profileID: _id });

  const test = await db.models.Courses.find({
    profileID: _id,
    name: "fcgvjhbkjn",
  });
  console.log(test._id, "test");

  return json({
    userId: session.get("userId"),
    Profile,
    isProfile,
    courses,
    education,
    _id,
    test,
  });
}

export async function action({ request }) {
  const session = await requireUserSession(request);
  const body = await request.formData();
  const db = await connectDb();
  var id = await db.models.Profiles.find({
    userId: session.get("userId"),
  });

  var trim = id[0].bio.slice(0, 120) + " ...";
  var model = {
    name: body.get("Name"),
    date: new Date(),
    email: body.get("Email"),
    phone: body.get("Phone"),
    profilePic: body.get("ProfilePic"),
    bio: body.get("Bio"),
    trimBio: trim,
    tags: body.get("Tags"),
    userId: session.get("userId"),
    linkedIn: body.get("LinkedIn"),
    portfolio: body.get("Portfolio"),
  };
  var _id = id[0]._id;
  // var courseModel = {
  //   profileID: _id,
  //   name: body.get("course"),
  // };
  var courses = await db.models.Courses.find({ profileID: _id });
  // const test = await db.models.Courses.find({
  //   profileID: _id,
  //   name: courses[0].name,
  // });
  try {
    await db.models.Profiles.findByIdAndUpdate(id, model);
    for (var i = 0; i < courses.length; i++) {
      var diffCourseName = "";
      diffCourseName = "course" + i;
      var courseModel = {
        profileID: _id,
        name: body.get(diffCourseName),
      };
      var test = await db.models.Courses.find({
        profileID: _id,
        name: courses[i].name,
      });
      await db.models.Courses.findByIdAndUpdate(test[0]._id, courseModel);
    }
    // await db.models.Courses.findOneAndUpdate(
    //   { name: body.get("course") },
    //   { $set: { name } }
    // );
    return redirect("/profile");
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(body) },
      { status: 400 }
    );
  }
}

export default function Update() {
  const { Profile, isProfile, courses, education, _id, test } = useLoaderData();
  const { userId } = useLoaderData();
  console.log(test, "test");
  var i = -1;
  // console.log(courses[0].name + i, "test");
  if (userId) {
    return (
      <div>
        <Nav />
        <div className="flex content-around justify-around m-10">
          <div className="Create-Form">
            <br />
            <Form method="post" className="border-2 rounded p-10">
              <div className=" container flex">
                <div className="left px-5">
                  <label>
                    First and Last Name
                    <br />
                    <input
                      name="Name"
                      type="text"
                      size="41"
                      defaultValue={isProfile[0].name}
                      placeholder="Your Name"
                      className="my-3 px-5"
                    />
                  </label>
                  <br /> <br />
                  <b>Contacts:</b>
                  <br />
                  <label>
                    Email
                    <br />
                    <input
                      name="Email"
                      type="text"
                      size="41"
                      defaultValue={Profile.username}
                      className="my-3 px-5"
                    />
                  </label>
                  <br /> <br />
                  <label>
                    Tell us Something about yourself "Bio"
                    <br />
                    <textarea
                      name="Bio"
                      placeholder="Your Bio"
                      defaultValue={isProfile[0].bio}
                      rows="4"
                      cols="40"
                      className="my-3 px-5"
                    />
                  </label>
                  <br /> <br />
                  <label>
                    LinkedIn link
                    <br />
                    <input
                      name="LinkedIn"
                      type="text"
                      defaultValue={isProfile[0].linkedIn}
                      size="41"
                      placeholder="Optional LinkedIn Link"
                      className="my-3 px-5"
                    />
                  </label>
                </div>
                <div className="right px-5">
                  <label>
                    Profile Picture URL
                    <br />
                    <input
                      name="ProfilePic"
                      type="text"
                      defaultValue={isProfile[0].profilePic}
                      size="41"
                      placeholder="Image URL"
                      className="my-3 px-5"
                    />
                  </label>
                  <br /> <br /> <br />
                  <label>
                    Phone Number
                    <br />
                    <input
                      name="Phone"
                      type="phone"
                      defaultValue={isProfile[0].phone}
                      size="41"
                      placeholder={"+45 12345678"}
                      className="my-3 px-5"
                    />
                  </label>
                  <br /> <br />
                  <label>
                    What are your competencies
                    <br />
                    <textarea
                      name="Tags"
                      placeholder="Good Listener, Java Script, Pascal, etc"
                      defaultValue={isProfile[0].tags}
                      rows="4"
                      cols="40"
                      className="my-3 px-5"
                    />
                  </label>
                  <br /> <br />
                  <label>
                    Github or Portfolio link
                    <br />
                    <input
                      name="Portfolio"
                      type="text"
                      defaultValue={isProfile[0].portfolio}
                      size="41"
                      placeholder="Optional Github or Portfolio Link"
                      className="my-3 px-5"
                    />
                  </label>
                </div>
              </div>
              {courses.length > 0 ? (
                <div className="Courses ">
                  <br />
                  <b className="px-5">Extracurricular Courses</b>
                  <div>
                    {/* <input
                      key={i}
                      name={courses[0].name + i}
                      type="text"
                      defaultValue={courses[0].name}
                      size="41"
                      placeholder="Course"
                      className="my-3 mx-5 px-5 "
                    /> */}

                    {courses.map((course) => {
                      i++;
                      console.log("course" + i, "xxx");
                      return (
                        <input
                          key={course.name + i}
                          name={"course" + i}
                          type="text"
                          defaultValue={course.name}
                          size="41"
                          placeholder="Course"
                          className="my-3 mx-5 px-5 "
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <br />
              )}
              <br /> <br />
              <div className="flex justify-around content-around">
                <button
                  type="submit"
                  className="px-5 py-3 bg-emerald-800 text-white text-xl text-center mr-5 rounded-md hover:scale-105 hover:cursor-pointer duration-300 content-center transition-all "
                >
                  Update
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <h1>
        <b className="text-red-500">You can't acces this page</b>
      </h1>
    );
  }
}
