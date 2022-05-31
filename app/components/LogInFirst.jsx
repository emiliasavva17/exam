import BackHome from "./BackHome";

export default function AlreadyLoggedIn() {
  return (
    <div>
      <BackHome />
      <br />
      <br />
      <br />
      <div className="flex m-0 justify-center content-around">
        <h1 className="text-red-500 text-5xl"> You need to Log In first!</h1>
      </div>
    </div>
  );
}
