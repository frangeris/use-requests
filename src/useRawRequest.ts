import Service from "./service";

export function useRawRequest() {
  return (url: string) => {
    return new Service(url, { bypass: true });
  };
}

export default useRawRequest;
