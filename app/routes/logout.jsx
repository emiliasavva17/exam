import { getSession, destroySession } from "~/sessions.server";
import { redirect } from "@remix-run/node";

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export function loader({ request }) {
  return redirect("/login");
}
