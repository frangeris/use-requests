import { useRequest } from "@/useRequests";
import context from "@/context";

enum Test {}

describe("useRequest", () => {
  it("should return the context.useRequests object", () => {
    const result = useRequest<typeof Test>();
    expect(result).toBe(context.useRequests);
  });
});
