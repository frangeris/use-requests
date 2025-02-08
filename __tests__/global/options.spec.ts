import { Options } from "@/global/options";

describe("Options", () => {
  it("should create a new instance with given options", () => {
    const ins = Options.instance({ method: "GET" });
    expect(ins).toBeDefined();
    expect(ins.method).toEqual("GET");
  });

  it("should maintain the same singleton instance", () => {
    const instance1 = Options.instance();
    const instance2 = Options.instance({ method: "POST" });

    expect(instance1).toBe(instance2);
    expect(instance1.method).toEqual("GET");
  });

  it("should have a default headers property as an instance of Headers", () => {
    const instance = Options.instance();
    expect(instance.headers).toBeInstanceOf(Headers);
  });
});
