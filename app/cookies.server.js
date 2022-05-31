import { createCookie } from "@remix-run/node";

export const sessionCookie = createCookie("__session", {
  httpOnly: true,
  maxAge: 86400,
  secrets: [process.env.COOKIE_SECRET],
});
export const profileCookie = createCookie("__profileAs", {
  httpOnly: true,
  maxAge: 86400,
});
