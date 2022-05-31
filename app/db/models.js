import { mongoose } from "mongoose";

const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "That's too short"],
    },
  },
  { timestamps: true }
);

const users = new Schema({
  username: {
    type: String,
    required: true,
    minLength: [5, "That's too short"],
  },
  password: {
    type: String,
    required: true,
    minLength: [3, "That's too short"],
  },
  profileAs: {
    type: String,
  },
});
const ProfilesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
  profilePic: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    minLength: [5, "That's too short"],
  },
  phone: {
    type: String,
  },
  bio: {
    type: String,
    required: true,
    minLength: [20, "That's too short"],
  },
  trimBio: {
    type: String,
  },
  tags: {
    type: String,
    required: false,
  },
  linkedIn: {
    type: String,
  },
  portfolio: {
    type: String,
  },
  // course: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Courses",
  // },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

const Courses = new Schema({
  profileID: String,
  name: String,
});
const Education = new Schema({
  profileID: String,
  name: String,
  faculty: String,
  place: String,
  subjects: String,
  start: Date,
  end: Date,
});
const RecruiterProfilesSchema = new Schema({
  fav: Boolean,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});
export const models = [
  {
    name: "Profiles",
    schema: ProfilesSchema,
    collection: "profiles",
  },
  {
    name: "Courses",
    schema: Courses,
    collection: "Courses",
  },
  {
    name: "Education",
    schema: Education,
    collection: "Education",
  },
  {
    name: "Users",
    schema: users,
    collection: "users",
  },
];
