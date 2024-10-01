import { Service } from "./service";

export type Opts = {
  base: string;
  headers?: Headers;
};

export type ServicesType = Record<string, Service>;

export type Services<T> = { [P in keyof T]: Service };

export type ServiceResponse<T> = Promise<Response & { data: T }>;

export type Path =
  | {
      params?: Record<string, string | number>;
      query?: Record<string, string | number>;
    }
  | string;

export type Operation = {
  path: string;
  op: string;
  value?: any;
};
