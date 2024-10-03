import Service from "./service";
import Options from "./options";
import context from "./context";

export function init(baseURL: string, endpoints: Record<string, string>) {
  Options.instance().opts = { baseURL };
  const requests = {};
  for (const key in endpoints) {
    Object.assign(requests, {
      [key]: new Service<unknown>(endpoints[key]),
    });
  }

  if (typeof context.useRequests === "undefined") {
    Object.defineProperty(globalThis, "useRequests", {
      value: requests,
      enumerable: false,
      configurable: true,
      writable: true,
    });
  }
}

export default init;
