import { useLoaderData, Link, Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getSession, commitSession } from "~/sessions.server";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";
import CatchBoundary from "../components/CatchBoundary";
import ErrorBoundary from "../components/ErrorBoundary";
import BackHome from "../components/BackHome";
import AlreadyLoggedIn from "../components/AlreadyLoggedIn";

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  //const session2 = await getSession(request.headers.get("Profile"));

  const db = await connectDb();
  const form = await request.formData();

  const user = await db.models.Users.findOne({
    username: form.get("username").trim(),
    //  password: pwd,
  });

  if (user) {
    let pwd = form.get("password").trim();
    let checkPwd = bcrypt.compareSync(pwd, user.password);
    if (checkPwd) {
      session.set("userId", user._id);
      //session2.set("profileAs", user.profileAs);
      return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
          //"Set-Cookie": await commitSession(session2),
        },
      });
    } else {
      return json({ errorMessage: "Password didn't match" }, { statrus: 401 });
    }
  } else {
    return json({ errorMessage: "User not found " }, { statrus: 401 });
  }
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const session2 = await getSession(request.headers.get("Profile"));
  return json({
    userId: session.get("userId"),
    profileAs: session.get("profileAs"),
  });
}
function hashing(pwd) {
  var hash = bcrypt.hashSync(pwd, 10);
  return hash;
}
export default function LogIn() {
  const { userId, profileAs } = useLoaderData();
  const actionData = useActionData();

  if (!userId) {
    return (
      <div>
        <BackHome />

        <div className="flex  justify-around content-around ">
          <div className="m-10 p-5 flex-col w-8/12  content-center justify-center  text-center border-2 border-teal-800 rounded ">
            <h1 className="p-1 text-2xl font-bold">Log In</h1>
            <br />
            {actionData?.errorMessage ? (
              <p
                className="text-red-500 font-bold my-3"
                // className={`p-2 rounded-md w-full ${
                //       actionData?.errors.description
                //         ? "border-2 border-red-500"
                //         : null
                //     }
              >
                {actionData.errorMessage}
              </p>
            ) : null}
            <form method="post" className="">
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                className="block my-3 border rounded text-black px-2 py-1 w-full"
              />

              <input
                type="password"
                name="password"
                id="password"
                placeholder="password"
                className="block my-3 border rounded text-black px-2 py-1 w-full"
              />

              <div>
                <button
                  type="submit"
                  className="my-3 p-2 border rounded text-white bg-teal-800"
                >
                  Log In
                </button>
                <p>
                  <span>Don't have an account? </span>
                  <Link to="/register" className="underline">
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  } else {
    return <AlreadyLoggedIn />;
  }
}
export { CatchBoundary, ErrorBoundary };
