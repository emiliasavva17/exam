import { Form, useActionData, useLoaderData, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getSession, commitSession } from "~/sessions.server";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";
import CatchBoundary from "~/components/CatchBoundary";
import ErrorBoundary from "~/components/ErrorBoundary";
import BackHome from "../components/BackHome";
import AlreadyLoggedIn from "../components/AlreadyLoggedIn";

function stringContainsNumber(_string) {
  let matchPattern = _string.match(/\d+/g);
  if (matchPattern != null) {
    return true;
  } else {
    return false;
  }
}
function isUpper(str) {
  var isUpperCase = false;
  for (var i = 0; i < str.length; i++) {
    if (/[A-Z]/.test(str[i])) {
      isUpperCase = true;
    }
  }
  return isUpperCase;
}

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const db = await connectDb();
  const form = await request.formData();

  const user = await db.models.Users.findOne({
    username: form.get("username").trim(),
  });
  console.log("length ", form.get("username").trim().length);
  if (form.get("username").trim().length < 3) {
    return json(
      { errorMessage: "Username should be longer then 5" },
      { statrus: 401 }
    );
  }
  if (user) {
    return json({ errorMessage: "This user alredy exists" }, { statrus: 401 });
  } else if (
    form.get("password").trim() !== form.get("repeatPassword").trim()
  ) {
    return json({ errorMessage: "Password didn't match" }, { statrus: 401 });
  } else if (form.get("password") === "") {
    return json({ errorMessage: "Type your password" }, { statrus: 401 });
  } else if (form.get("password").length < 3) {
    return json(
      { errorMessage: "Password shoud be longer then 3" },
      { statrus: 401 }
    );
  } else if (!stringContainsNumber(form.get("password"))) {
    return json(
      { errorMessage: "Your password must contain at least one number" },
      { statrus: 401 }
    );
  } else if (!isUpper(form.get("password"))) {
    return json(
      {
        errorMessage:
          "Your password must contain at least one Upper Case Character",
      },
      { statrus: 401 }
    );
  } else if (form.get("password").trim() == form.get("repeatPassword").trim()) {
    let hash = form.get("password").trim();
    var pwd = bcrypt.hashSync(hash, 10);
    const newUser = await db.models.Users.create({
      username: form.get("username").trim(),
      password: pwd,
      profileAs: form.get("profileAs"),
    });
    session.set("userId", newUser._id);
    return redirect("/createProfile", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));

  return json({
    userId: session.has("userId"),
  });
}
// function hashing(pwd) {
//   var hash = bcrypt.hashSync(pwd, 10);
//   return hash;
// }
export default function Register() {
  const { userId } = useLoaderData();
  const actionData = useActionData();

  if (!userId) {
    return (
      <div>
        <BackHome />

        <div className="flex justify-around content-around">
          <div className="m-10 p-5 flex-col w-8/12 pb-32  content-center justify-center text-center border-2 border-teal-800 rounded ">
            <h1 className="p-1 text-2xl font-bold">Register</h1>
            <br />

            {actionData?.errorMessage ? (
              <p
                className="text-red-500 font-bold my-2"
                // className={`p-2 rounded-md w-full ${
                //       actionData?.errors.description
                //         ? "border-2 border-red-500"
                //         : null
                //     }
              >
                {actionData.errorMessage}
              </p>
            ) : null}
            <Form method="post" className="">
              <input
                type="email"
                name="username"
                id="username"
                placeholder="Email"
                className="block text-black my-3 border rounded px-2 py-1 w-full"
              />

              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="block text-black my-3 border rounded px-2 py-1 w-full"
              />

              <input
                type="password"
                name="repeatPassword"
                id="repeatPassword"
                placeholder="Confirm password"
                className="block text-black my-3 border rounded px-2 py-1 w-full"
              />
              <div>
                <br />
                <div className="flex content-items-center justify-evenly content-evenly items-center justify-items-center">
                  Create account as:
                  <select
                    id="profileAs"
                    name="profileAs"
                    className="  p-2 rounded-lg flex md:w-[30%] w-[60%]  bg-snippet-dark-1"
                  >
                    <option value="developer">Developer</option>
                    <option value="recruiter">Recruiter</option>
                  </select>{" "}
                </div>

                <button
                  type="submit"
                  className="my-3 p-2 border rounded text-white font-bold bg-teal-800"
                >
                  Register
                </button>
                <p>
                  <span>Already have an account? </span>
                  <Link to="/login" className="underline">
                    Log In
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  } else {
    return <AlreadyLoggedIn />;
  }
}

export { CatchBoundary, ErrorBoundary };
