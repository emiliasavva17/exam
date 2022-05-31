import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { sessionCookie, profileCookie } from "./cookies.server";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: sessionCookie,
    profileAs: profileCookie,
  });

export async function requireUserSession(request) {
  // get the session
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);

  // validate the session, `userId` is just an example, use whatever value you
  // put in the session when the user authenticated
  // if (!session.has("userId")) {
  //   // if there is no user session, redirect to login
  //   throw redirect("/login");
  // }

  return session;
}
export async function requireProfileAs(request) {
  const profileAs = request.headers.get("cookie");
  const session = await getSession(profileAs);
  return session;
}
export { getSession, commitSession, destroySession };
