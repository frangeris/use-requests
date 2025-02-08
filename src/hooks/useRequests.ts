import { Services } from "@/types";
import context from "@/global/context";

export function useRequest<T>() {
  const ctx = context?.();
  if (!ctx) {
    throw new Error("init must be called before using useRequest");
  }

  return ctx.services as Services<T>;
}

export default useRequest;
