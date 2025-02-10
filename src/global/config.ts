export class Config {
  static #instance: Config;
  public baseURL?: string;
  public request?: RequestInit;
  public headers?: Headers;

  private constructor(config?: Config) {
    this.headers = new Headers();
    this.baseURL = "";
    this.request = {};

    if (config) {
      for (const k in config) {
        (this as any)[k] = (config as any)[k];
      }
    }
  }

  public static instance(config?: Config): Config {
    if (!Config.#instance) {
      Config.#instance = new Config(config);
    }

    return Config.#instance;
  }
}

export default Config;
