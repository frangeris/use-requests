import { Services } from "./types";
import { getServices } from "./init";

export function useRequest<T>(): Services<T> {
  return getServices();
}

export default useRequest;
