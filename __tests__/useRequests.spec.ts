import { useRequest } from "@/useRequests";
import { getServices } from "@/init";
import { Services } from "@/types";

jest.mock("@/init", () => ({
  getServices: jest.fn(),
}));

describe("useRequest", () => {
  it("should call getServices", () => {
    useRequest();
    expect(getServices).toHaveBeenCalled();
  });

  it("should return the value from getServices", () => {
    const mockServices: Services<any> = {};
    (getServices as jest.Mock).mockReturnValue(mockServices);
    const result = useRequest();
    expect(result).toBe(mockServices);
  });
});
