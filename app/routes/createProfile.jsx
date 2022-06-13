import { Link, Form, useLoaderData, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";
import { requireUserSession } from "../sessions.server";
import Nav from "../components/Nav";
import LogInFirst from "../components/LogInFirst";
import BackHome from "../components/BackHome";
import CantAccesThisPage from "../components/CantAccesThisPage";

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
  const body = await request.formData();
  const db = await connectDb();

  var model = {
    name: body.get("Name"),
    date: new Date(),
    email: body.get("Email"),
    phone: body.get("Phone"),
    profilePic: body.get("ProfilePic"),
    bio: body.get("Bio"),
    trimBio: body.get("Bio").slice(0, 120) + " ...",
    tags: body.get("Tags"),
    userId: session.get("userId"),
    linkedIn: "",
    portfolio: "",
    // course: body.get("Course"),
    // education: body.get("Education"),
  };
  try {
    await db.models.Profiles.create(model);
    return redirect("/");
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(body) },
      { status: 400 }
    );
  }
}
export default function CreateProfile() {
  const actionData = useActionData();
  const { Profile } = useLoaderData();
  const { userId } = useLoaderData();
  const { isProfile } = useLoaderData();
  console.log("profile ", Profile.profileAs);
  console.log(actionData?.errors.name, " error");
  if (userId && isProfile < 1 && Profile.profileAs != "recruiter") {
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
                      defaultValue={actionData?.values.name}
                      size="41"
                      placeholder={"Your Name"}
                      className={`my-3 px-5 ${
                        actionData?.errors.name
                          ? "border-2 border-red-500"
                          : null
                      }`}
                    />{" "}
                    {actionData?.errors.name ? (
                      <p className="text-red-500">
                        {actionData?.errors.name.message}
                      </p>
                    ) : (
                      <span></span>
                    )}
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
                      defaultValue={
                        actionData?.values.email ?? Profile.username
                      }
                      className={`my-3 px-5 ${
                        actionData?.errors.email
                          ? "border-2 border-red-500"
                          : null
                      }`}
                    />{" "}
                    {actionData?.errors.email ? (
                      <p className="text-red-500">
                        {" "}
                        {actionData?.errors.email.message}
                      </p>
                    ) : (
                      <span></span>
                    )}
                  </label>
                  <br /> <br />
                  <label>
                    Tell us Something about yourself "Bio"
                    <br />
                    <textarea
                      name="Bio"
                      placeholder="Your Bio"
                      defaultValue={actionData?.values.bio}
                      rows="4"
                      cols="40"
                      className={`my-3 px-5 ${
                        actionData?.errors.bio
                          ? "border-2 border-red-500"
                          : null
                      }`}
                    />{" "}
                    {actionData?.errors.bio ? (
                      <p className="text-red-500">
                        {actionData?.errors.bio.message}
                      </p>
                    ) : (
                      <span></span>
                    )}
                  </label>
                </div>
                <div className="right px-5">
                  <label>
                    Profile Picture URL
                    <br />
                    <input
                      name="ProfilePic"
                      type="text"
                      size="41"
                      defaultValue={actionData?.values.profilePic}
                      placeholder="Image URL"
                      cclassName={`my-3 px-5 ${
                        actionData?.errors.profilePic
                          ? "border-2 border-red-500"
                          : null
                      }`}
                    />
                  </label>
                  {actionData?.errors.profilePic ? (
                    <p className="text-red-500">
                      {actionData?.errors.profilePic.message}
                    </p>
                  ) : (
                    <span></span>
                  )}
                  <br /> <br /> <br />
                  <label>
                    Phone Number
                    <br />
                    <input
                      name="Phone"
                      type="phone"
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
                      rows="4"
                      cols="40"
                      className="my-3 px-5"
                    />
                  </label>
                </div>
              </div>
              {/* <br /> <br />
            <label>
              LinkedIn link
              <br />
              <input
                name="LinkedIn"
                type="text"
                size="51"
                placeholder="Optional LinkedIn Link"
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
                size="51"
                placeholder="Optional Github or Portfolio Link"
                className="my-3 px-5"
              />
            </label>
            <br /> <br />
            <label>
              Do you have any extra courses or certificates <br />
              What are thouse?
              <br />
              <textarea
                name="Course"
                placeholder="Advanced CSS, Fixing a sink pipes?!? , Something like That, etc"
                rows="4"
                cols="50"
                className="my-3 px-5"
              />
            </label>
            <br /> <br />
            <label>
              Would you like to tell about your education <br />
              <br />
              <textarea
                name="Education"
                placeholder="IBA Kolding - Multimedia Design  -- 2019-2021, etc"
                rows="4"
                cols="50"
                className="my-3 px-5"
              />
            </label> */}
              <br /> <br />
              <div className="flex justify-around content-around">
                <button
                  type="submit"
                  className="px-5 py-3 bg-emerald-800 text-white text-xl text-center mr-5 rounded-md hover:scale-105 hover:cursor-pointer duration-300 content-center transition-all "
                >
                  Create Profile
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  } else if (userId && isProfile > 1) {
    if (isProfile[0].name) {
      return (
        <div>
          <BackHome />
          <br />
          <br />
          <br />
          <div className="flex m-0 justify-center content-around">
            <div>
              <h1 className="text-3xl text-red-500">
                You have already created a Profile
              </h1>

              <br />
              <Link to="/profile" className="underline">
                {" "}
                Go to Your account instead
              </Link>
            </div>
          </div>
        </div>
      );
    }
  } else if (Profile.profileAs == "recruiter") {
    return (
      <div>
        <CantAccesThisPage />
      </div>
    );
  } else {
    return (
      <div>
        <LogInFirst />
        <Link to="/login" className="underline">
          {" "}
          Log In
        </Link>
      </div>
    );
  }
}
