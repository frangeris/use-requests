import { Service } from "./service";

export type InitOptions = {
  baseURL: string;
  headers?: Headers;
};

export type Services<T> = { [K in keyof T]: Service<T[K]> };

export type ServiceResponse<R> = { data: R } & Response;

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
    : never;

export type PatchOperation = {
  path: string;
  op: string;
  value?: any;
};
