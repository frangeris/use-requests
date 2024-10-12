import Service from "@/service";
import Options from "@/options";

global.fetch = jest.fn(() => ({
  json: () => Promise.resolve({ test: true }),
})) as jest.Mock;

describe("service", () => {
  beforeEach(() => {
    Options.instance = jest.fn().mockReturnValue({
      baseURL: "https://api.example.com",
    });
  });

  describe("buildUrl", () => {
    it("should return nothing when no path and resource are provided", () => {
      const service = new Service();
      const url = service["buildUrl"]();
      expect(url).toBe("");
    });

    it("should return resource if no path is provided", () => {
      const service = new Service("/resource");
      const url = service["buildUrl"]();
      expect(url).toBe("/resource");
    });

    it("should return the path and resource", () => {
      const service = new Service("/resource");
      const url = service["buildUrl"]("/path");
      expect(url).toBe("/resource/path");
    });

    it("should return use the path property", () => {
      const service = new Service("/resource");
      const url = service["buildUrl"]({ path: "/another" });
      expect(url).toBe("/resource/another");
    });

    it("should replace parameters in resource", () => {
      const service = new Service("/resource/:id");
      const url = service["buildUrl"]({ params: { id: "123" } });
      expect(url).toBe("/resource/123");
    });

    it("should throw an error if path parameters are missing", () => {
      const service = new Service("/resource/:id");
      expect(() => service["buildUrl"]({})).toThrow("Missing path parameters");
    });

    it("should throw an error if multiple path parameters are missing", () => {
      const service = new Service("/resource/:a/test/:b/test/:c");
      expect(() => service["buildUrl"]({})).toThrow("Missing path parameters");
    });

    it("should include query parameters", () => {
      const service = new Service("/resource");
      const url = service["buildUrl"]({ query: { search: "test" } });
      expect(url).toBe("/resource?search=test");
    });

    it("should build a URL with both path and query parameters", () => {
      const service = new Service("/resource/:id");
      const url = service["buildUrl"]({
        params: { id: "123" },
        query: { search: "test" },
      });
      expect(url).toBe("/resource/123?search=test");
    });
  });

  describe("buildRequest", () => {
    it("should construct a Request object correctly", () => {
      const service = new Service("/resource");
      const req = service["buildRequest"]({ method: "GET", path: "/hello" });
      expect(req.url).toBe("https://api.example.com/resource/hello");
    });

    it("should throw an error if baseURL is not provided", () => {
      Options.instance = jest.fn().mockReturnValue({});
      const service = new Service("/resource");
      expect(() => service["buildRequest"]({ method: "GET" })).toThrow(
        "Missing baseURL in options"
      );
    });

    it("should use the resource as baseURL if bypass is true", async () => {
      const url = "https://api.example.com/resource";
      const service = new Service(url, { bypass: true });
      const req = await service["buildRequest"]({ method: "GET" });
      expect(req.url).toBe(url);
    });
  });

  describe("buildResponse", () => {
    it("should return data undefined when body is not present", async () => {
      const service = new Service("/resource");
      const res = await service["buildResponse"](new Response());
      expect(await res.data).toBeNull();
    });

    it("should return an object with data", async () => {
      const dummy = { data: { key: "value" } };
      const service = new Service("/resource");
      const res = await service["buildResponse"](
        new Response(JSON.stringify(dummy))
      );
      expect(await res.data).toEqual(dummy.data);
    });
  });
});
