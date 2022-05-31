import { Link, Form } from "@remix-run/react";

export default function SnippetList(props) {
  const snippets = props.snippets;
  const handleClick = props.handleClick;
  return (
    <div className="w-[60%] flex flex-col h-full overflow-y-scroll overflow-x-hidden shadow-inner ">
      <div className=" w-full flex justify-center items-center py-5 px-3 flex-col ">
        <Form method="GET" className=" w-full h-full  ">
          <input
            type="text"
            name="searchQuery"
            id="myInput"
            placeholder="Search"
            title="search"
            className=" w-[80%] h-5 shadow-inner p-5 rounded-lg bg-snippet-dark-1 "
          ></input>
          <button
            type="submit"
            className=" w-[10%] ml-[5px] hover:cursor-pointer "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16.727"
              height="16.728"
              viewBox="0 0 16.727 16.728"
            >
              <g
                id="Icon_feather-search"
                data-name="Icon feather-search"
                transform="translate(-3.5 -3.5)"
              >
                <path
                  id="Path_251"
                  data-name="Path 251"
                  d="M17.223,10.862A6.362,6.362,0,1,1,10.862,4.5a6.362,6.362,0,0,1,6.362,6.362Z"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  id="Path_252"
                  data-name="Path 252"
                  d="M28.434,28.434l-3.459-3.459"
                  transform="translate(-9.621 -9.621)"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </g>
            </svg>
          </button>
        </Form>

        <div className=" flex w-full mt-[10px] ">
          <Form method="GET" className=" w-full h-full flex ">
            <select
              name="filter_selector"
              defaultValue="Sort"
              className="w-[80%]  shadow-inner p-3 rounded-lg bg-snippet-dark-1  bg-no-repeat  text-gray-200 "
            >
              <option value="Sort" disabled>
                Sort
              </option>
              <option value="title_az" name="title_az">
                by title A-Z
              </option>
              <option value="title_za" name="title_za">
                by title Z-A
              </option>
              <option value="last_updated" name="last_updated">
                by last updated
              </option>
              <option value="fav" name="fav">
                by favourite
              </option>
            </select>
            <button
              type="submit"
              className=" w-[10%] ml-[5px] hover:cursor-pointer "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="18.199"
                viewBox="0 0 20 18.199"
              >
                <path
                  id="Icon_feather-filter"
                  data-name="Icon feather-filter"
                  d="M21,4.5H3l7.2,8.514V18.9l3.6,1.8V13.014Z"
                  transform="translate(-2 -3.5)"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </Form>
        </div>
      </div>
      <div id="list-id">
        {snippets.map((snippet) => {
          return (
            <div
              key={snippet._id}
              onClick={handleClick}
              className="w-full flex justify-center items-center hover:shadow-inner duration-300 transition-all hover:cursor-pointer hover:shadow-slate-900 rounded-md text-base p-4 "
            >
              <Link to={"/snippets/" + snippet._id}>{snippet.title}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
