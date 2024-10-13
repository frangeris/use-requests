import { RequestPath, ServiceOptions, ServiceResponse } from "./types";
import Options from "./options";

export class Service<P> {
  private resource?: string;
  private controller: AbortController;
  private options?: ServiceOptions;

  constructor(resource?: string, options: ServiceOptions = { bypass: false }) {
    if (resource) {
      this.resource = resource;
    }

    this.options = options;
    this.controller = new AbortController();
  }

  private buildUrl(path?: RequestPath<P>): string {
    // when no resource, a raw request
    let url = this.resource ?? "";

    // no need to build path
    if (typeof path === "string") {
      return url + path;
    }

    // not path provided, plain url
    if (!path) {
      return url;
    }

    // build complex path
    const { params, query, path: customPath } = path;
    if (customPath) {
      url += customPath;
    }

    if (params) {
      for (const k in params) {
        url = url.replace(`:${k}`, `${params[k]}`);
      }
    } else if (url.includes(":")) {
      throw new Error("Missing path parameters");
    }

    if (query) {
      const params = Object.entries(query).map(([k, v]) => [k, v.toString()]);
      const qs = new URLSearchParams(params);
      url += `?${qs.toString()}`;
    }

    return url;
  }

  private buildRequest(req: RequestInit & { path?: RequestPath<P> }): Request {
    let baseURL = "";
    const { headers } = Options.instance();

    // for normal requests (not raw), base url is required
    if (!this.options?.bypass) {
      const { baseURL: initialURL } = Options.instance();
      if (!initialURL) {
        throw new Error("Missing baseURL in options");
      }
      baseURL = initialURL;
    }

    const { path, ...rest } = req;
    const url = baseURL + this.buildUrl(path);
    const request = new Request(url, {
      headers,
      signal: this.controller.signal,
      ...rest,
    });

    return request;
  }

  private buildResponse<T>(res: Response) {
    // gets populated only when acceded
    Object.defineProperty(res, "data", {
      get() {
        return (async () => {
          try {
            const data = (await res.json()) as { data: T };
            return data?.data ?? null;
          } catch (err) {
            console.error(err);
            return null;
          }
        })();
      },
      enumerable: true,
      configurable: false,
    });

    return res as ServiceResponse<T>;
  }

  private makeRequest(req: Request): Promise<Response> {
    return fetch(req);
  }

  // HTTP methods
  async get<T>(path?: RequestPath<P>) {
    const req = this.buildRequest({ path, method: "GET" });
    const res = await this.makeRequest(req);

    return this.buildResponse<T>(res);
  }

  async post<T>(
    payload: any,
    path?: RequestPath<P>
  ): Promise<ServiceResponse<T>> {
    const req = await this.buildRequest({
      path,
      method: "POST",
      body: JSON.stringify(payload),
    });
    const res = await this.makeRequest(req);

    return this.buildResponse<T>(res);
  }

  async put<T>(
    payload: any,
    path?: RequestPath<P>
  ): Promise<ServiceResponse<T>> {
    const req = await this.buildRequest({
      path,
      method: "PUT",
      body: JSON.stringify(payload),
    });
    const res = await this.makeRequest(req);

    return this.buildResponse<T>(res);
  }

  async delete<T>(path?: RequestPath<P>): Promise<ServiceResponse<T>> {
    const req = await this.buildRequest({ path, method: "DELETE" });
    const res = await this.makeRequest(req);

    return this.buildResponse<T>(res);
  }

  async patch<T>(
    ops: {
      path: string;
      op: "add" | "remove" | "replace" | "move" | "copy" | "test";
      value?: any;
    }[],
    path?: RequestPath<P>
  ): Promise<ServiceResponse<T>> {
    const req = await this.buildRequest({
      path,
      method: "PATCH",
      body: JSON.stringify(ops),
    });
    const res = await this.makeRequest(req);

    return this.buildResponse<T>(res);
  }
}

export default Service;
