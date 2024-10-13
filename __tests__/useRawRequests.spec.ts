import { useRawRequest } from "@/index";
import Service from "@/service";

global.fetch = jest.fn(() => ({
  json: () => Promise.resolve({}),
})) as jest.Mock;

describe("useRawRequest", () => {
  it("should return a function", async () => {
    const raw = useRawRequest();
    expect(raw).toBeDefined();
    expect(raw).toBeInstanceOf(Function);
  });

  it("should return an instance of service", async () => {
    const raw = useRawRequest();
    expect(raw("http://api.example.io/example")).toBeInstanceOf(Service);
  });

  it("should make a GET request", async () => {
    const raw = useRawRequest();
    const { status } = await raw("http://api.test.com").get();
    expect(status).toBe(200);
  });

  it("should make a POST request", async () => {
    const raw = useRawRequest();
    const { status } = await raw("http://api.test.com").post({});
    expect(status).toBe(200);
  });

  it("should make a PUT request", async () => {
    const raw = useRawRequest();
    const { status } = await raw("http://api.test.com").put({});
    expect(status).toBe(200);
  });
});

describe("useRawRequest: http methods", () => {
  let raw: ReturnType<typeof useRawRequest>;

  beforeEach(() => {
    raw = useRawRequest();
  });

  it("should make a GET request", async () => {
    const { status } = await raw("http://api.test.com").get();
    expect(status).toBe(200);
  });

  it("should make a POST request", async () => {
    const { status } = await raw("http://api.test.com").post({});
    expect(status).toBe(200);
  });

  it("should make a PUT request", async () => {
    const { status } = await raw("http://api.test.com").put({});
    expect(status).toBe(200);
  });

  it("should make a DELETE request", async () => {
    const { status } = await raw("http://api.test.com").delete();
    expect(status).toBe(200);
  });

  it("should make a PATCH request", async () => {
    const { status } = await raw("http://api.test.com").patch([
      { op: "add", path: "/test", value: "test" },
    ]);
    expect(status).toBe(200);
  });
});
