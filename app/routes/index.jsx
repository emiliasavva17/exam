import { useLoaderData, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";
import { json } from "@remix-run/node";
import Nav from "../components/Nav";
import { useState } from "react";
import RecruiterNav from "../components/RecruiterNav";

export async function loader({ request }) {
  const db = await connectDb();
  const session = await requireUserSession(request);
  const Profiles = await db.models.Profiles.find();
  const myProfile = await db.models.Profiles.find({
    userId: session.get("userId"),
  });
  const role = await db.models.Users.find({ _id: session.get("userId") });
  return json({ userId: session.get("userId"), Profiles, role, myProfile });
}

export default function Index() {
  const { Profiles, role, userId, myProfile } = useLoaderData();
  const [searchText, setSearchText] = useState("");
  const [show, setShow] = useState(null);
  console.log(role, "role");
  const toggle = (i) => {
    if (show == i) {
      return setShow(null);
    }
    setShow(i);
  };
  return (
    <div>
      {role.length > 0 ? (
        <div>
          {role[0].profileAs == "recruiter" ? <RecruiterNav /> : <Nav />}
        </div>
      ) : (
        <Nav />
      )}

      <div className="w-6/12 bg-slate-200">
        {/* Search bar */}
        <div className="w-full pt-5">
          <input
            type="text"
            className="mb-5 ml-3 p-2 w-11/12"
            value={searchText}
            placeholder="Search for a snippet"
            onChange={(event) => {
              setSearchText(event.target.value);
            }}
          ></input>

          <div>
            {Profiles.filter((profile) => {
              if (
                profile.name
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                profile.tags?.toLowerCase().includes(searchText.toLowerCase())
              ) {
                return profile;
              } else if (searchText == "") {
                return profile;
              }
            }).map((profile, i) => {
              var tagsArr = profile.tags.split(",");
              return (
                <div
                  className=" border-b-2 border-y-slate-300 border-solid flex  content-center  px-10 py-6"
                  key={profile._id}
                  // onClick={() => toggle(i)}
                  // to={`/profiles/${profile._id}`}
                >
                  <div className="w-3/12 mr-10">
                    <img
                      src={profile.profilePic}
                      alt="profile picture"
                      className=" h-24 w-24 mr-10 rounded-full "
                    />

                    <br />
                    <h1 className="text-left text-sm">
                      <b className="font-serif ">Created at : </b>
                      {new Date(profile.date).toLocaleDateString([], {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </h1>
                  </div>
                  <div className="flex-col align-items-center text-center w-8/12">
                    <Link
                      // to={`/${profile._id}`}
                      to={`/profiles/${profile._id}`}
                      className=" hover:underline text-center font-bold text-lg py-7"
                    >
                      {profile.name}
                    </Link>
                    <br />

                    <p className="text-left ">{profile.trimBio}</p>

                    {/* <div className="text-left"> */}
                    {/* <b className="font-serif">Competences : </b> <br />{" "} */}
                    <div className="px-3 mt-3 text-left">
                      {tagsArr.map((tag) => {
                        if (tag) {
                          if (
                            searchText &&
                            tag
                              ?.toLowerCase()
                              .includes(searchText.toLowerCase())
                          ) {
                            return (
                              <span
                                key={tag}
                                className=" mx-1.5 px-2.5 py-1.5  bg-red-200 border-red-700 border-2  text-sm rounded-full w-full leading-10"
                              >
                                {" "}
                                {tag + " "}
                              </span>
                            );
                          } else {
                            return (
                              <span
                                key={tag}
                                className=" mx-1.5 px-2.5 py-1.5  bg-green-200 border-emerald-700 border-2  text-sm rounded-full w-full leading-10"
                              >
                                {" "}
                                {tag + " "}
                              </span>
                            );
                          }
                        }
                      })}
                    </div>
                    {/* </div> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {Profiles.map((profile, i) => {
          var tagsArr = profile.tags.split(",");

          return (
            <div
              className={
                show == i
                  ? " border-b-2 border-y-slate-300 border-solid flex  content-center  px-10 py-6"
                  : "hidden"
              }
              key={profile._id}
            >
              <div className="w-3/12 mr-10">
                <img
                  src={profile.profilePic}
                  alt="profile picture"
                  className=" h-24 w-24 mr-10 rounded-full "
                />

                <br />
                <h1 className="text-left text-sm">
                  <b className="font-serif ">Created at : </b>
                  {new Date(profile.date).toLocaleDateString([], {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </h1>
              </div>
              <div className="flex-col align-items-center text-center w-8/12">
                <Link
                  to={`/${profile._id}`}
                  className=" hover:underline text-center font-bold text-lg py-7"
                >
                  {profile.name}
                </Link>
                <br />

                <p className="text-left ">{profile.trimBio}</p>

                {/* <div className="text-left"> */}
                {/* <b className="font-serif">Competences : </b> <br />{" "} */}
                <div className="px-3 mt-3 text-left">
                  {tagsArr.map((tag) => {
                    if (tag) {
                      return (
                        <span
                          key={tag}
                          className=" mx-1.5 px-2.5 py-1.5  bg-green-200 border-emerald-700 border-2  text-sm rounded-full w-full leading-10"
                        >
                          {" "}
                          {tag + " "}
                        </span>
                      );
                    }
                  })}
                </div>
                {/* </div> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* <ul className="ml-5 list-disc">
        {Profiles.map((profile) => {
          return (
            <li key={profile._id}>
              <Link
                to={`/${profile._id}`}
                className="text-blue-600 hover:underline"
              >
                {profile.name}
              </Link>
            </li>
          );
        })}
        {/* {books.map((book) => {
          return (
            <li key={book._id}>
              <Link
                to={`/books/${book._id}`}
                className="text-blue-600 hover:underline"
              >
                {book.title}
              </Link>
            </li>
          );
        })}//
      </ul> */}
    </div>
  );
}
