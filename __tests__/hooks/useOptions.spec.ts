import useOptions from "@/hooks/useOptions";

describe("useOptions", () => {
  it("should return a singleton instance", () => {
    const instance1 = useOptions();
    const instance2 = useOptions();
    expect(instance1).toBe(instance2);
  });

  it("should set and retrieve baseURL correctly", () => {
    const opts = useOptions();
    opts.baseURL = "http://example.com";
    expect(opts.baseURL).toBe("http://example.com");
  });

  it("should set and retrieve headers correctly", () => {
    const opts = useOptions();
    opts.headers.set("authorization", "token");
    expect(opts.headers.get("authorization")).toBe("token");
  });
});
