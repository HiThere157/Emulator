export default async function makeApiCall<T>(
  url: string,
  init?: RequestInit,
  minDelay: number = 0,
): Promise<ApiResult<T>> {
  // Make the request and wait for the response
  // Also wait for the minimum delay to pass - this is to prevent the UI from
  // updating too quickly, which can cause a bad user experience
  const [response] = await Promise.all([
    fetch(url, init),
    new Promise((resolve) => setTimeout(resolve, minDelay)),
  ]);

  // If the response is ok, return the result
  if (response.ok) {
    // Try to parse the result as JSON
    const result = await response.text();
    try {
      return {
        result: JSON.parse(result) as T,
      };
    } catch (error) {
      return {
        result: result as T,
      };
    }
  }

  return {
    error: (await response.text()) || "Something went wrong",
  };
}
