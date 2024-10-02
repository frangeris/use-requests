import { init, getServices } from "@/init";
import { Service } from "@/service";
import { Options } from "@/options";

// jest.mock("./service");
// jest.mock("./options");

describe("init", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // delete globalThis.services;
  });

  it("should initialize options correctly", () => {
    // const mockInstance = { opts: {} };
    // (Options.instance as jest.Mock).mockReturnValue(mockInstance);
    const base = "http://myapi.io/test";
    enum endpoints {
      endpoint1 = "/endpoint1",
    }
    init(base, { ...endpoints });
    // expect(Options.instance).toHaveBeenCalled();
    // expect(mockInstance.opts).toEqual({ base });
  });

  // it("should create services correctly", () => {
  //   const base = "http://example.com";
  //   const endpoints = { endpoint1: "/api/endpoint1" };

  //   init(base, endpoints);

  //   expect(Service).toHaveBeenCalledWith("/api/endpoint1");
  // });

  // it("should define globalThis.services correctly", () => {
  //   const base = "http://example.com";
  //   const endpoints = { endpoint1: "/api/endpoint1" };

  //   init(base, endpoints);

  //   expect(globalThis.services).toBeDefined();
  //   expect(globalThis.services.endpoint1).toBeInstanceOf(Service);
  // });

  // it("should not redefine globalThis.services if already defined", () => {
  //   globalThis.services = { existingService: "existing" };

  //   const base = "http://example.com";
  //   const endpoints = { endpoint1: "/api/endpoint1" };

  //   init(base, endpoints);

  //   expect(globalThis.services).toEqual({ existingService: "existing" });
  // });
});
