import { redirect } from "@remix-run/node";
import { Link, Form, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";

export async function loader({ params }) {
  const db = await connectDb();
  const snippet = await db.models.CodeSnippet.findById(params.snippetId);

  return snippet;
}
export async function action({ request }) {
  const body = await request.formData();
  var id = body.get("_id");
  var action = body.get("action");
  if (action == "delete") {
    const db = await connectDb();
    db.models.CodeSnippet.findByIdAndDelete(id).exec();
    return redirect("/");
  } else if (action == "fav_update") {
    const db = await connectDb();
    const snippet = await db.models.CodeSnippet.findById(id);

    var model = {
      favourite: !snippet.favourite,
    };

    db.models.CodeSnippet.findByIdAndUpdate(id, model).exec();
    return redirect("/snippets/" + id);
  }
  console.log(body);
  return null;
}

export default function SnippetId() {
  async function copyToClipboard() {
    var copyText = document.getElementById("codeBox");
    var data = copyText.innerHTML;
    await navigator.clipboard.writeText(data);
  }

  const snippet = useLoaderData();
  var favButtonClassName = "#464646";
  if (snippet.favourite == true) {
    favButtonClassName = "#1e8e8c";
  }
  return (
    <div
      id="content-section"
      className="md:w-[68%] w-full flex flex-col  h-full overflow-y-auto "
    >
      <div key={snippet._id}>
        <div className=" flex flex-col md:m-12 m-4 ">
          <h1 className=" mb-5 ">{snippet.title}</h1>
          <p className=" mb-12 font-medium ">{snippet.language}</p>
          <p className=" mb-12 font-medium ">{snippet.description}</p>

          <div className="p-5 rounded-xl flex w-[95%] h-full shadow-inner shadow-gray-900 mb-20 ">
            <pre className=" w-full break-words whitespace-pre-wrap ">
              <code>{snippet.code_snippet}</code>
            </pre>

            <div className=" ml-auto w-[5%] h-full flex justify-end items-start ">
              <button
                onClick={() => {
                  copyToClipboard();
                }}
                className="ml-5 font-medium hover:cursor-pointer "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15.086"
                  height="18.856"
                  viewBox="0 0 15.086 18.856"
                >
                  <g
                    id="Icon_ionic-ios-copy"
                    data-name="Icon ionic-ios-copy"
                    transform="translate(-4.5 -1.125)"
                  >
                    <path
                      id="Path_248"
                      data-name="Path 248"
                      d="M24.157,5.017h3.536a.236.236,0,0,0,.236-.236h0a1.1,1.1,0,0,0-.393-.837L24.507,1.423a1.469,1.469,0,0,0-.809-.291h0a.29.29,0,0,0-.291.291V4.271A.752.752,0,0,0,24.157,5.017Z"
                      transform="translate(-8.343 -0.003)"
                      fill="#fff"
                    />
                    <path
                      id="Path_249"
                      data-name="Path 249"
                      d="M16.528,4.268V1.125H11.382a1.261,1.261,0,0,0-1.257,1.257v13.2a1.261,1.261,0,0,0,1.257,1.257H20.81a1.261,1.261,0,0,0,1.257-1.257V6.036H18.3A1.77,1.77,0,0,1,16.528,4.268Z"
                      transform="translate(-2.482)"
                      fill="#fff"
                    />
                    <path
                      id="Path_250"
                      data-name="Path 250"
                      d="M6.543,18.667V5.625H5.757A1.261,1.261,0,0,0,4.5,6.882V20.71a1.261,1.261,0,0,0,1.257,1.257H15.814a1.261,1.261,0,0,0,1.257-1.257v-.786H7.8A1.261,1.261,0,0,1,6.543,18.667Z"
                      transform="translate(0 -1.986)"
                      fill="#fff"
                    />
                  </g>
                </svg>
              </button>
            </div>
          </div>

          <div className=" fixed bottom-5 md:right-5 left-[11%] md:left-auto flex ">
            <Form method="post">
              <input
                type="hidden"
                name="_id"
                defaultValue={snippet._id}
              ></input>
              <button
                type="submit"
                name="action"
                value="fav_update"
                id="fav_icon"
                style={{ backgroundColor: favButtonClassName }}
                className={` ml-3 md:py-3 md:px-5 py-1 px-3 font-medium shadown-lg shadow-gray-900   rounded-md text-white`}
              >
                Favourite &#9733;
              </button>
            </Form>

            <Link to={"/snippets/Update/" + snippet._id}>
              <button className=" ml-3 md:py-3 md:px-5 py-1 px-3 font-medium shadown-lg shadow-gray-900 bg-snippet-emerald rounded-md text-white ">
                Edit
              </button>
            </Link>

            <Form method="post">
              <input
                type="hidden"
                name="_id"
                defaultValue={snippet._id}
              ></input>
              <button
                type="submit"
                name="action"
                value="delete"
                className=" ml-3 md:py-3 md:px-5 py-1 px-3 font-medium shadown-lg shadow-gray-900 bg-snippet-emerald rounded-md text-white "
              >
                Delete
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
