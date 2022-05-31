import { Link } from "@remix-run/react";
export default function BackHome() {
  return (
    <header className="pb-3 mb-4 border-b-2 flex justify-between px-9">
      <Link to="/" className="hover:underline text-blue-600">
        Back to Home Page
      </Link>
    </header>
  );
}
