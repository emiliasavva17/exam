import { redirect, json } from "@remix-run/node";
import { Form, useLoaderData, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import {
  requireUserSession,
  getSession,
  commitSession,
} from "~/sessions.server";
import bcrypt from "bcryptjs";

export async function action({ request }) {
  const db = await connectDb();

  const users = await db.models.Users;
  const profiles = await db.models.Profiles;
  const education = await db.models.Education;
  const courses = await db.models.Courses;

  await users.deleteMany();
  await profiles.deleteMany();
  await education.deleteMany();
  await courses.deleteMany();

  var pwd = bcrypt.hashSync("test1", 10);

  // user 1
  var newUser = await db.models.Users.create({
    username: "emilia@mail.com",
    password: pwd,
    profileAs: "developer",
  });

  var newProfile = await db.models.Profiles.create({
    userId: newUser._id,
    name: "Emilia Savva",
    date: new Date(),
    bio: "Lorem ipsum dolor sit amet. In eligendi velit et dolorem voluptatibus sit esse atque aut ratione rerum et dolores aliquid vel cupiditate dolore ut dolore voluptas! Aut sunt itaque ea distinctio culpa qui amet natus est minima officia. Aut nisi accusantium ab alias animi qui vero recusandae et perspiciatis rerum aliquam sunt sed culpa nam repellat voluptas.",
    profilePic:
      "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80",

    tags: "Html,Css,Php,Pascal,Sql,C++,Agorithms",
    linkedIn: "https://www.linkedin.com",
    portfolio: "https://github.com/",
  });

  // user 2

  newUser = await db.models.Users.create({
    username: "dima@mail.com",
    password: pwd,
    user_type: "student",
  });

  newProfile = await db.models.Students.create({
    userId: newUser._id,
    name: "Dima Preda",
    date: new Date(),
    bio: "Ex commodi corrupti et quia aliquid in quis rerum. Est quia optio nam quia galisum et veritatis omnis. Sit ullam laborum et unde voluptate ea deleniti et consequatur dolorem in praesentium perferendis est tempore nulla. Non debitis quibusdam sit impedit error non omnis rerum. ",
    profile_img:
      "https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
    tags: "Ruby, Kotlin, MySQL,Python,Algorithms,Dynamic Programming, Binary Trees, OOP",
    linkedIn: "https://www.linkedin.com",
    portfolio: "https://github.com/",
  });

  // user 3
  newUser = await db.models.Users.create({
    username: "nastea@mail.com",
    password: pwd,
    user_type: "student",
  });

  newProfile = await db.models.Students.create({
    userId: newUser._id,
    name: "Anastasia Ivanova",
    date: new Date(),
    bio: "Quo architecto illum est neque iste et dolorum quisquam. Cum soluta adipisci id omnis laudantium sit nemo deserunt et laborum aspernatur non accusamus dolorem aut accusamus placeat. Cum iure recusandae ut velit quia aut assumenda dolor. Et eveniet dolorum ex quas voluptas aut provident impedit? ",
    profile_img:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    tags: "Ruby,some,random,words, Kotlin, MySQL,Python,Algorithms,Dynamic Programming, Binary Trees, OOP",
    linkedIn: "https://www.linkedin.com",
    portfolio: "https://github.com/",
  });

  // user 4
  newUser = await db.models.Users.create({
    username: "violeta@mail.com",
    password: pwd,
    user_type: "student",
  });

  newProfile = await db.models.Students.create({
    userId: newUser._id,
    name: "Violeta Deharo",
    date: new Date(),
    bio: "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",
    profile_img:
      "https://images.unsplash.com/photo-1554727242-741c14fa561c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    tags: "Html,some,random,words, Kotlin, MySQL,Python,Java,Dynamic Programming, CSS, OOP",
    linkedIn: "https://www.linkedin.com",
    portfolio: "https://github.com/",
  });

  // user 5
  newUser = await db.models.Users.create({
    username: "alfred@mail.com",
    password: pwd,
    user_type: "student",
  });

  newProfile = await db.models.Students.create({
    userId: newUser._id,
    name: "Aldred Ursu",
    date: new Date(),
    bio: "Qui sint accusamus est quibusdam optio hic dolor voluptas. Eos omnis omnis non neque pariatur et voluptas corporis aut consequatur mollitia? Ut eius temporibus qui illo temporibus et eius dolore aut repellendus mollitia in eligendi nostrum aut assumenda culpa est aspernatur molestias. ",
    profile_img:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80",
    tags: "C#,C++,Basics,Remix,Ionic,Python,Angular",
    linkedIn: "https://www.linkedin.com",
    portfolio: "https://github.com/",
  });

  return redirect("/logout");
}

export default function Seed() {
  return (
    <div className="seed-page">
      <Form method="POST" className="">
        <button type="submit">Seed the database</button>
      </Form>
      it is better to creat yourself at least oe profile and in the update you
      can add courses and education
    </div>
  );
}
