import Service from "@/service";
import Options from "@/options";

global.fetch = jest.fn(() => ({
  json: () => Promise.resolve({}),
})) as jest.Mock;

describe("service", () => {
  beforeEach(() => {
    Options.instance = jest.fn().mockReturnValue({
      opts: { base: "http://example.com" },
    });
  });

  describe("build", () => {
    it("should return empty string if no path is provided", () => {
      const service = new Service("/resource");
      expect(service["build"]()).toBe("");
    });

    it("should return the path if a string path is provided", () => {
      const service = new Service("/resource");
      expect(service["build"]("/path")).toBe("/path");
    });

    it("should replace parameters in resource", () => {
      const service = new Service("/resource/:id");
      const path = { params: { id: "123" } };
      expect(service["build"](path)).toBe("/resource/123");
    });

    it("should throw an error if path parameters are missing", () => {
      const service = new Service("/resource/:id");
      expect(() => service["build"]({})).toThrow("Missing path parameters");
    });

    it("should include query parameters", () => {
      const service = new Service("/resource");
      const path = { query: { search: "test" } };
      expect(service["build"](path)).toBe("/resource?search=test");
    });

    it("should build a URL with both path and query parameters", () => {
      const service = new Service("/resource/:id");
      const path = { params: { id: "123" }, query: { search: "test" } };
      expect(service["build"](path)).toBe("/resource/123?search=test");
    });
  });

  describe("request", () => {
    it("should construct a Request object correctly", async () => {
      const service = new Service("/resource");
      const opts = { method: "get", path: "/hello" };
      await service["request"](opts);
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
