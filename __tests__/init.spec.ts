import { init } from "@/init";
import { Options } from "@/options";
import Service from "@/service";
import useRequest from "@/useRequests";

enum Test {
  endpoint1 = "/endpoint1",
  endpoint2 = "/endpoint2",
  endpoint3 = "/endpoint3",
}

describe("init", () => {
  const baseURL = "http://api.example.io";
  beforeEach(() => {
    jest.clearAllMocks();
    init(baseURL, { ...Test });
  });

  it("should set the baseURL correctly", () => {
    expect(Options.instance().baseURL).toBe(baseURL);
  });

  it("should create services correctly", () => {
    const ctx = useRequest<typeof Test>();
    expect(ctx.endpoint1).toBeDefined();
    expect(ctx.endpoint1).toBeInstanceOf(Service);

    expect(ctx.endpoint2).toBeDefined();
    expect(ctx.endpoint2).toBeInstanceOf(Service);

    expect(ctx.endpoint3).toBeDefined();
    expect(ctx.endpoint3).toBeInstanceOf(Service);
  });

  it("should define globalThis.useRequests correctly", () => {
    // @ts-ignore
    expect(globalThis.useRequests).toBeDefined();
  });
});
