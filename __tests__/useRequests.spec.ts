import type { ServiceResponse } from "@/types";
import { useRequests, init } from "@/index";
import context from "@/context";

global.fetch = jest.fn(() => ({
  status: 200,
  json: () => Promise.resolve(),
  data: {},
})) as jest.Mock;

enum Api {
  test = "/test",
}

describe("useRequests: without init", () => {
  it("should throw an error if not initialized first", () => {
    expect(() => useRequests<typeof Api>()).toThrow(
      "init must be called before using useRequest"
    );
  });
});

describe("useRequests", () => {
  beforeEach(() => {
    init("http://api.example.io", { endpoints: Api });
  });

  it("should return the context.useRequests object", () => {
    const result = useRequests<typeof Api>();
    expect(result).toBe(context.useRequests);
    expect(result).toHaveProperty("test");
  });

  it("should return an instance of ServiceResponse", async () => {
    const { test } = useRequests<typeof Api>();
    const r = await test.get();
    expect(r).toHaveProperty("data");
  });

  it("should make a GET request", async () => {
    const { test } = useRequests<typeof Api>();
    const { status } = await test.get();
    expect(status).toBe(200);
  });

  it("should make a POST request", async () => {
    const { test } = useRequests<typeof Api>();
    const { status } = await test.post({ data: "test" });
    expect(status).toBe(200);
  });

  it("should make a PUT request", async () => {
    const { test } = useRequests<typeof Api>();
    const { status } = await test.put({});
    expect(status).toBe(200);
  });

  it("should make a DELETE request", async () => {
    const { test } = useRequests<typeof Api>();
    const { status } = await test.delete();
    expect(status).toBe(200);
  });

  it("should make a PATCH request", async () => {
    const { test } = useRequests<typeof Api>();
    const { status } = await test.patch([
      { op: "add", path: "/test", value: "test" },
    ]);
    expect(status).toBe(200);
  });

  it("should make a request with query params", async () => {
    const { test } = useRequests<typeof Api>();
    const { status } = await test.get({ query: { test: "test" } });
    expect(status).toBe(200);
  });
});
