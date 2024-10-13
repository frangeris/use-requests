import { init, useRequests, useRawRequest, useOptions } from "../src";

// Test the library with the JSONPlaceholder API
// https://jsonplaceholder.typicode.com/

// can be defined globally
enum Api {
  posts = "/posts",
  comments = "/comments",
}
init("https://jsonplaceholder.typicode.com", { ...Api });

const normal = async () => {
  console.info("✨ Normal requests");
  const { posts, comments } = useRequests<typeof Api>();

  let t = await posts.get();
  console.log(t.status, "GET /posts");

  t = await posts.post({});
  console.log(t.status, "POST /posts");

  t = await posts.put({}, { path: "/:id", params: { id: 1 } });
  console.log(t.status, "PUT /posts/1");

  t = await posts.patch([{ op: "add", path: "/tests", value: true }], {
    path: "/:id",
    params: { id: 1 },
  });
  console.log(t.status, "PATCH /posts/1");

  t = await posts.delete({ path: "/:id", params: { id: 1 } });
  console.log(t.status, "DELETE /posts/1");

  t = await posts.get({ path: "/:id/comments", params: { id: 1 } });
  console.log(t.status, "GET /posts/1/comments");

  t = await comments.get({ query: { postId: 1 } });
  console.log(t.status, "GET /comments?postId=1");
  console.log("\n");
};

// same requests can be done with raw requests
const raw = async () => {
  console.info("⚡️ Raw requests");
  const raw = useRawRequest();
  const r = await raw("https://jsonplaceholder.typicode.com");

  let t = await r.get("/posts");
  console.log(t.status, "GET /posts");

  // parameters in url are also supported and can be passed as an object too
  // but is doesnt throw an error if the parameter is not passed
  t = await r.get({
    path: "/posts/:id",
    params: { id: 1 },
  });
  console.log(t.status, "GET /posts/1");
};

// run all examples sequentially
(async () => {
  await normal();
  await raw();
})();
