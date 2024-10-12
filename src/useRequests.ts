import { Services } from "./types";
import context from "./context";

export function useRequest<T>() {
  const ctx = context.useRequests;
  if (!ctx) {
    throw new Error("init must be called before using useRequest");
  }

  return context.useRequests as Services<T>;
}

export default useRequest;
