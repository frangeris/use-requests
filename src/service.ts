import Options from "./options";
import { ServiceResponse, Path, Operation } from "./types";

export class Service {
  public headers: Headers = new Headers();

  private base: string;
  private resource: string;
  private controller: AbortController;

  constructor(resource: string) {
    const opts = Options.instance().opts;
    if (!opts) {
      throw new Error("Options not initialized, use initServices");
    }

    this.base = opts?.base;
    this.resource = resource;
    this.controller = new AbortController();
  }

  private request(opts: RequestInit & { path?: Path }): Promise<Response> {
    const { path, ...rest } = opts;
    const { base, headers } = this;
    const url = base + this.build(path);
    const request = new Request(url, {
      headers,
      signal: this.controller.signal,
      ...rest,
    });

    return fetch(request);
  }

  private build(path?: Path) {
    if (!path) {
      return "";
    }

    if (typeof path === "string") {
      return path;
    }

    // build complex path
    let url = this.resource;
    const { params, query } = path;
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

  private async response<T>(request: Response): ServiceResponse<T> {
    return {
      ...request,
      data: (await request.json()) as T,
    };
  }

  // utils
  private abort() {
    this.controller.abort();
  }

  // HTTP methods
  async get<T>(path?: Path): ServiceResponse<T> {
    const request = await this.request({
      path,
      method: "get",
    });

    return this.response<T>(request);
  }

  async head(path?: Path): Promise<Response> {
    const request = await this.request({
      path,
      method: "head",
    });

    return this.response<void>(request);
  }

  async post<T>(payload: any, path?: Path): ServiceResponse<T> {
    const request = await this.request({
      path,
      method: "post",
      body: JSON.stringify(payload),
    });

    return this.response<T>(request);
  }

  async put<T>(payload: any, path?: Path): ServiceResponse<T> {
    const request = await this.request({
      path,
      method: "put",
      body: JSON.stringify(payload),
    });

    return this.response<T>(request);
  }

  async delete<T>(path?: Path): ServiceResponse<T> {
    const request = await this.request({
      path,
      method: "delete",
    });

    return this.response<T>(request);
  }

  async patch<T>(ops: Operation[], path?: Path): ServiceResponse<T> {
    const request = await this.request({
      path,
      method: "patch",
    });

    return this.response<T>(request);
  }
}

export default Service;
