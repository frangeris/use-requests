import type { Context } from "@/types";
import { init } from "@/core/init";
import { Options } from "@/global/options";
import Service from "@/core/service";
import useRequest from "@/hooks/useRequests";

enum Test {
  endpoint1 = "/endpoint1",
  endpoint2 = "/endpoint2",
  endpoint3 = "/endpoint3",
}

describe("init", () => {
  const base = "http://api.example.io";
  beforeEach(() => {
    jest.clearAllMocks();
    init({ base, endpoints: Test });
  });

  it("should set the baseURL correctly", () => {
    expect(Options.instance().baseURL).toBe(base);
  });

  it("should define globalThis.useRequests correctly", () => {
    const ctx = globalThis as unknown as Context;
    expect(ctx.useRequests).toBeDefined();
  });

  it("should create services correctly", () => {
    const svs = useRequest<typeof Test>();
    expect(svs.endpoint1).toBeDefined();
    expect(svs.endpoint1).toBeInstanceOf(Service);

    expect(svs.endpoint2).toBeDefined();
    expect(svs.endpoint2).toBeInstanceOf(Service);

    expect(svs.endpoint3).toBeDefined();
    expect(svs.endpoint3).toBeInstanceOf(Service);
  });
});
