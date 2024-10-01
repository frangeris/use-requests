import { Opts } from "./types";

export class Options {
  static #instance: Options;
  public opts?: Opts;

  public static instance(): Options {
    if (!Options.#instance) {
      Options.#instance = new Options();
    }

    return Options.#instance;
  }
}

export default Options;
