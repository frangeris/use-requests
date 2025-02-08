import type { ServiceConfig, ServiceMap } from "@/types";
import Service from "@/core/service";
import Options from "@/global/options";
import context from "@/global/context";

export function init(config: ServiceConfig) {
  const { endpoints, base, request } = config;

  // request options used by service
  Options.instance(request).baseURL = base;

  // create service client per endpoint with shared options
  const services: ServiceMap = {};
  for (const key in endpoints) {
    Object.assign(services, {
      [key]: new Service<unknown>(endpoints[key], config),
    });
  }

  const ctx = context?.();
  if (
    typeof ctx?.services === "undefined" ||
    typeof ctx?.config === "undefined"
  ) {
    Object.defineProperty(globalThis, "useRequests", {
      value: { services, config },
      enumerable: false,
      configurable: true,
      writable: true,
    });
  }
}

export default init;
