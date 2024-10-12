import { RequestPath, PatchOperation, ServiceOptions } from "./types";
import Options from "./options";

class ServiceResponse<T> extends Response {
  private response?: Response;

  constructor(res: Response) {
    super(res.body, res);
    this.response = res;
  }

  public get data() {
    return (async () => {
      const response = this.response;
      if (response) {
        const { ok, body } = response;
        let data = null;
        if (ok) {
          const reader = body?.getReader();
          const decoder = new TextDecoder();
          let result = "";
          while (true) {
            const { value, done } = await reader!.read();
            if (done) break;
            result += decoder.decode(value, { stream: true });
          }
          reader?.releaseLock();
          data = JSON.parse(result) as unknown;
        }

        return data;
      }

      return null;
    })();
  }
}

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

  private buildPath(path?: RequestPath<P>) {
    // no need to build path
    if (typeof path === "string") {
      return path;
    }

    let url = this.resource || "";
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

  private buildRequest(
    req: RequestInit & { path?: RequestPath<P> }
  ): Promise<Response> {
    let baseURL = "";
    const { headers } = Options.instance();

    // not raw requests
    if (!this.options?.bypass) {
      const { baseURL: initialURL } = Options.instance();
      if (!initialURL) {
        throw new Error("Missing baseURL in options");
      }
    } else {
      baseURL = this.resource || "";
    }

    const { path, ...rest } = req;
    const url = this.options?.bypass
      ? this.buildPath(path)
      : baseURL + this.buildPath(path);
    const request = new Request(url, {
      headers,
      signal: this.controller.signal,
      ...rest,
    });

    return fetch(request);
  }

  private buildResponse<T>(res: Response): ServiceResponse<T> {
    return new ServiceResponse<T>(res);
  }

  // HTTP methods
  async get<T>(path?: RequestPath<P>) {
    const response = await this.buildRequest({
      path,
      method: "GET",
    });

    return this.buildResponse<T>(response);
  }

  async post<T>(
    payload: any,
    path?: RequestPath<P>
  ): Promise<ServiceResponse<T>> {
    const request = await this.buildRequest({
      path,
      method: "POST",
      body: JSON.stringify(payload),
    });

    return this.buildResponse<T>(request);
  }

  async put<T>(
    payload: any,
    path?: RequestPath<P>
  ): Promise<ServiceResponse<T>> {
    const request = await this.buildRequest({
      path,
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return this.buildResponse<T>(request);
  }

  async delete<T>(path?: RequestPath<P>): Promise<ServiceResponse<T>> {
    const request = await this.buildRequest({
      path,
      method: "DELETE",
    });

    return this.buildResponse<T>(request);
  }

  async patch<T>(
    ops: PatchOperation[],
    path?: RequestPath<P>
  ): Promise<ServiceResponse<T>> {
    const request = await this.buildRequest({
      path,
      method: "PATCH",
      body: JSON.stringify(ops),
    });

    return this.buildResponse<T>(request);
  }
}

export default Service;
