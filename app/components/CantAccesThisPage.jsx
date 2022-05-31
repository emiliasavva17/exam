import BackHome from "./BackHome";

export default function CantAccesThisPage() {
  return (
    <div>
      <BackHome />
      <br />
      <br />
      <br />
      <div className="flex m-0 justify-center content-around">
        <h1 className="text-red-500 text-5xl"> You cant acces this page!</h1>
      </div>
    </div>
  );
}
