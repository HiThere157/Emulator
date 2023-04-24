export default async function makeApiCall<T>(
  url: string,
  type: "json" | "text" | "buffer",
  init?: RequestInit,
): Promise<ApiResult<T>> {
  const response = await fetch(url, init);

  // If the response is ok, return the result
  if (response.ok) {
    try {
      if (type === "text") {
        return {
          result: (await response.text()) as T,
        };
      }

      if (type === "buffer") {
        return {
          result: (await response.arrayBuffer()) as T,
        };
      }

      if (type === "json") {
        return {
          result: (await response.json()) as T,
        };
      }
    } catch {
      return {
        error: "Unable to parse response",
      };
    }
  }

  return {
    error: (await response.text()) || "Something went wrong",
  };
}
