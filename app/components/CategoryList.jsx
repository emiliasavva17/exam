import { Link } from "@remix-run/react";
export default function CategoryList(props) {
  return (
    <div className=" w-[40%] flex flex-col h-full overflow-y-auto justify-center items-center border-r-2 border-r-snippet-dark-1 ">
      <div className=" w-full flex justify-center items-center py-5 px-3 ">
        <h3 className="text-lg text-snippet-white-1 hover:text-white hover:cursor-pointer  duration-300 transition-all ">
          <Link to="?category=">All</Link>
        </h3>
      </div>
      <div className=" w-full flex justify-center items-center py-5 px-3 ">
        <h3 className="text-lg text-snippet-white-1 hover:text-white hover:cursor-pointer  duration-300 transition-all">
          <Link to="?category=HTML">HTML</Link>
        </h3>
      </div>
      <div className=" w-full flex justify-center items-center py-5 px-3 ">
        <h3 className="text-lg text-snippet-white-1 hover:text-white hover:cursor-pointer  duration-300 transition-all">
          <Link to="?category=CSS">CSS</Link>
        </h3>
      </div>
      <div className=" w-full flex justify-center items-center py-5 px-3 ">
        <h3 className="text-lg text-snippet-white-1 hover:text-white hover:cursor-pointer  duration-300 transition-all">
          <Link to="?category=JavaScript">JavaScript</Link>
        </h3>
      </div>
    </div>
  );
}
