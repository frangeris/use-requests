import Options from "@/options";

describe("options", () => {
  it("should return a singleton instance", () => {
    const instance1 = Options.instance();
    const instance2 = Options.instance();
    expect(instance1).toBe(instance2);
  });

  it("should have undefined opts initially", () => {
    const instance = Options.instance();
    expect(instance.opts).toBeUndefined();
  });

  it("should set and retrieve opts correctly", () => {
    const instance = Options.instance();
    const opts = { baseURL: "http://example.com" };
    instance.opts = opts;
    expect(instance.opts).toEqual(opts);
  });
});
