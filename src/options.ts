import { InitOptions } from "./types";

export class Options {
  static #instance: Options;
  public baseURL?: string;
  public headers: Headers = new Headers();
  public fetchOptions: RequestInit = {};

  public static instance(): Options {
    if (!Options.#instance) {
      Options.#instance = new Options();
    }

    return Options.#instance;
  }
}

export default Options;
