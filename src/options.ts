import { InitOptions } from "./types";

export class Options {
  static #instance: Options;
  public opts?: InitOptions;

  public static instance(): Options {
    if (!Options.#instance) {
      Options.#instance = new Options();
    }

    return Options.#instance;
  }
}

export default Options;
