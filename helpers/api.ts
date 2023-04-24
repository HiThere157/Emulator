export default async function makeApiCall<T>(
  url: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  const response = await fetch(url, init);

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
