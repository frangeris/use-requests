import { Service } from "@/core/service";

export type InitOptions = {
  baseURL: string;
  headers?: Headers;
};

export type Services<T> = { [K in keyof T]: Service<T[K]> };

export type ServiceResponse<R> = Response & { data: R | null };

export type RequestPath<P> =
  | {
      path?: string;
      params?: ExtractParams<P>;
      query?: Record<string, string | number>;
    }
  | string;

export type ExtractParams<T> =
  T extends `${infer Start}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof ExtractParams<Rest>]: string | number }
    : T extends `${infer Start}:${infer Param}`
    ? { [k in Param]: string | number }
    : T extends `${infer Start}/${infer Rest}`
    ? ExtractParams<Rest>
    : {};

export type ServiceMap = Record<string, Service<unknown>>;

export type ServiceInterceptors = {
  onerror?: (response: Response) => void;
  onrequest?: (request: Request) => void;
  onresponse?: (response: Response) => void;
};

export type ServiceConfig = {
  base?: string;
  endpoints?: Record<string, string>;
  request?: RequestInit;
  interceptors?: ServiceInterceptors;
  throwOnError?: boolean;
  useBaseURL?: boolean;
};

export type Context = {
  useRequests: { services: ServiceMap; config: ServiceConfig };
};
