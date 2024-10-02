import { Service } from "./service";

export type InitOptions = {
  baseURL: string;
  headers?: Headers;
};

export type Services<T> = { [P in keyof T]: Service };

export type ServiceResponse<T> = Promise<Response & { data: T }>;

export type ServiceRequest = RequestInit & { path?: RequestPath };

export type RequestPath =
  | {
      // params?: Record<string, string | number>;
      params?: ExtractParams<"/test/:id/users/:two/:third">;
      query?: Record<string, string | number>;
    }
  | string;

type ExtractParams<T> = T extends `${infer Start}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof ExtractParams<Rest>]: string | number }
  : T extends `${infer Start}:${infer Param}`
  ? { [k in Param]: string | number }
  : never;

export type PatchOperation = {
  path: string;
  op: string;
  value?: any;
};
