import { Form, useActionData, useLoaderData, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getSession, commitSession } from "~/sessions.server";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";
import CatchBoundary from "~/components/CatchBoundary";
import ErrorBoundary from "~/components/ErrorBoundary";

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
      { errorMessage: "Username should be longer then 3" },
      { statrus: 401 }
    );
  }
  if (user) {
    return json({ errorMessage: "this user alredy exists" }, { statrus: 401 });
  } else if (
    form.get("password").trim() !== form.get("repeatPassword").trim()
  ) {
    return json({ errorMessage: "Password didn't match" }, { statrus: 401 });
  } else if (form.get("password") === "") {
    return json({ errorMessage: "Type your password" }, { statrus: 401 });
  } else if (form.get("password").trim() == form.get("repeatPassword").trim()) {
    let pwd = hashing(form.get("password").trim());
    const newUser = await db.models.Users.create({
      username: form.get("username").trim(),
      password: pwd,
    });
    session.set("userId", newUser._id);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));

  return json({
    userId: session.get("userId"),
  });
}
function hashing(pwd) {
  var hash = bcrypt.hashSync(pwd, 10);
  return hash;
}
export default function Register() {
  const { userId } = useLoaderData();
  const acrtionData = useActionData();

  if (!userId) {
    return (
      <div className="m-10 p-5 flex-col w-8/12  content-center justify-center  text-center border-2 border-teal-800 rounded ">
        <h1 className="p-1">Register ahfsa</h1>
        <br />

        {acrtionData?.errorMessage ? (
          <p
            className="text-red-500 font-bold my-2"
            // className={`p-2 rounded-md w-full ${
            //       actionData?.errors.description
            //         ? "border-2 border-red-500"
            //         : null
            //     }
          >
            {acrtionData.errorMessage}
          </p>
        ) : null}
        <Form method="post" className="">
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            className="block my-3 border rounded px-2 py-1 w-full"
          />

          <input
            type="password"
            name="password"
            id="password"
            placeholder="password"
            className="block my-3 border rounded px-2 py-1 w-full"
          />

          <input
            type="password"
            name="repeatPassword"
            id="repeatPassword"
            placeholder="repeat password"
            className="block my-3 border rounded px-2 py-1 w-full"
          />

          <button
            type="submit"
            className="my-3 p-2 border rounded text-white bg-teal-800"
          >
            Register
          </button>
        </Form>
      </div>
    );
  }

  // } else {
  //   return redirect("/");
  // }
}
export { CatchBoundary, ErrorBoundary };
