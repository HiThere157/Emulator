export default async function makeApiCall<T>(
  url: string,
  init?: RequestInit,
  minDelay: number = 0,
  raw: boolean = false,
): Promise<ApiResult<T>> {
  try {
    // Make the request and wait for the response
    // Also wait for the minimum delay to pass - this is to prevent the UI from
    // updating too quickly, which can cause a bad user experience
    const [response] = await Promise.all([
      fetch(url, init),
      new Promise((resolve) => setTimeout(resolve, minDelay)),
    ]);

    // If the response is ok, return the result
    if (response.ok) {
      if (raw) {
        return {
          result: (await response.arrayBuffer()) as T,
        };
      }

      // Try to parse the result as JSON
      const result = await response.text();
      try {
        return {
          result: JSON.parse(result) as T,
        };
      } catch {
        return {
          result: result as T,
        };
      }
    }

    return {
      error: (await response.text()) || "Something went wrong",
    };
  } catch {
    return {
      error: "Something went wrong",
    };
  }
}
