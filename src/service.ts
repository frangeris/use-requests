import Options from "./options";
import { ServiceResponse, RequestPath, PatchOperation } from "./types";

export class Service<P> {
  private resource?: string;
  private controller: AbortController;

  constructor(resource?: string) {
    if (resource) {
      this.resource = resource;
    }

    this.controller = new AbortController();
  }

  private request(
    req: RequestInit & { path?: RequestPath<P> }
  ): Promise<Response> {
    const { baseURL, headers } = Options.instance();
    if (!baseURL) {
      throw new Error("Missing baseURL in options");
    }

    const { path, ...rest } = req;
    const url = baseURL + this.build(path);
    const request = new Request(url, {
      headers,
      signal: this.controller.signal,
      ...rest,
    });

    return fetch(request);
  }

  private build(path?: RequestPath<P>) {
    if (typeof path === "string") {
      return path;
    }

    let url = this.resource || "";
    if (!path) {
      return url;
    }

    // build complex path
    const { params, query, path: customPath } = path;
    if (params) {
      for (const k in params) {
        // @ts-ignore
        url = url.replace(`:${k}`, `${params[k]}`);
      }
    } else if (url.includes(":")) {
      throw new Error("Missing path parameters");
    }

    if (customPath) {
      url += customPath;
    }

    if (query) {
      const params = Object.entries(query).map(([k, v]) => [k, v.toString()]);
      const qs = new URLSearchParams(params);
      url += `?${qs.toString()}`;
    }

    return url;
  }

  private async response<T>(res: Response): Promise<ServiceResponse<T>> {
    const newRes = res.clone() as Response as ServiceResponse<T>;
    newRes.data = async () => {
      try {
        return (await res.json()) as T;
      } catch (error) {
        return null;
      }
    };

    return newRes;
  }

  // HTTP methods
  async get<T>(path?: RequestPath<P>) {
    const response = await this.request({
      path,
      method: "GET",
    });

    return this.response<T>(response);
  }

  async post<T>(
    payload: any,
    path?: RequestPath<P>
  ): Promise<ServiceResponse<T>> {
    const request = await this.request({
      path,
      method: "POST",
      body: JSON.stringify(payload),
    });

    return this.response<T>(request);
  }

  async put<T>(
    payload: any,
    path?: RequestPath<P>
  ): Promise<ServiceResponse<T>> {
    const request = await this.request({
      path,
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return this.response<T>(request);
  }

  async delete<T>(path?: RequestPath<P>): Promise<ServiceResponse<T>> {
    const request = await this.request({
      path,
      method: "DELETE",
    });

    return this.response<T>(request);
  }

  async patch<T>(
    ops: PatchOperation[],
    path?: RequestPath<P>
  ): Promise<ServiceResponse<T>> {
    const request = await this.request({
      path,
      method: "PATCH",
      body: JSON.stringify(ops),
    });

    return this.response<T>(request);
  }
}

export default Service;
