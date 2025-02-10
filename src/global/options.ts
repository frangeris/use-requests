export class Options implements RequestInit {
  static #instance: Options;
  public baseURL?: string;

  // RequestInit
  headers: Headers;
  cache?: RequestCache;
  method?: string;
  body?: BodyInit | null;
  mode?: RequestMode;
  credentials?: RequestCredentials;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;

  private constructor(opts?: RequestInit) {
    this.headers = new Headers();
    this.baseURL = "";
    if (opts) {
      for (const k in opts) {
        (this as any)[k] = (opts as any)[k];
      }
    }
  }

  public static instance(opts?: RequestInit): Options {
    if (!Options.#instance) {
      Options.#instance = new Options(opts);
    }

    return Options.#instance;
  }
}

export default Options;
