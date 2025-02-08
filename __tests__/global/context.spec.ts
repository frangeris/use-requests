import type { Context } from "@/types";
import context from "@/global/context";
import init from "@/core/init";

const dummy: Context = {
  useRequests: {
    config: { base: "https://test.io" },
    services: {},
  },
};

describe("global context", () => {
  beforeEach(() => {
    init({ base: "https://test.io" });
  });

  it("should return the useRequests property from globalThis", () => {
    const result = context();
    expect(result).toEqual(dummy.useRequests);
  });
});
