import { Services } from "./types";
import context from "./context";

export function useRequest<T>() {
  return context.useRequests as Services<T>;
}

export default useRequest;
