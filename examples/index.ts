import { init, useRawRequest, useRequestsConfig, useServices } from "../src";

const base = "https://jsonplaceholder.typicode.com/";

// can be defined globally
enum Api {
  posts = "/posts",
  comments = "/comments",
}

init({ base, endpoints: Api });

const typed = async () => {
  console.info("✨ Typed requests");
  const { posts, comments } = useServices<typeof Api>();

  let t = await posts.get();
  console.log(t?.status, "GET /posts");

  t = await posts.post({});
  console.log(t?.status, "POST /posts");

  t = await posts.put({}, { path: "/:id", params: { id: 1 } });
  console.log(t?.status, "PUT /posts/1");

  t = await posts.patch([{ op: "add", path: "/tests", value: true }], {
    path: "/:id",
    params: { id: 1 },
  });
  console.log(t?.status, "PATCH /posts/1");

  t = await posts.delete({ path: "/:id", params: { id: 1 } });
  console.log(t?.status, "DELETE /posts/1");

  t = await posts.get({ path: "/:id/comments", params: { id: 1 } });
  console.log(t?.status, "GET /posts/1/comments");

  t = await comments.get({ query: { postId: 1 } });
  console.log(t?.status, "GET /comments?postId=1");
  console.log("\n");
};

// same requests can be done with raw requests
const raw = async () => {
  console.info("⚡️ Raw requests");
  const raw = useRawRequest();
  const r = await raw(base);

  let t = await r.get("/posts");
  console.log(t?.status, "GET /posts");

  // parameters in url are also supported and can be passed as an object too
  // but it doesn't throw an error if the parameter is not passed, so params
  // are not required
  t = await r.get({
    path: "/posts/:id",
    params: { id: 1 },
  });
  console.log(t?.status, "GET /posts/1");

  t = await r.get({
    path: `/posts/:id\\:top`,
    params: { id: 1 },
    query: {
      test: [1, 2, 3].join(","),
    },
  });
  console.log(t?.status, `GET ${t?.url}`);
};

// run all examples sequentially
(async () => {
  await typed();
  await raw();
})();
