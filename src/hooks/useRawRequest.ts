import Service from "@/core/service";

export function useRawRequest() {
  return (url: string) => {
    return new Service(url, { useBaseURL: false });
  };
}

export default useRawRequest;
