export default async function makeApiCall<T>(
  url: string,
  init?: RequestInit,
): Promise<[string | null, T | null]> {
  const response = await fetch(url, init);

  // If the response is ok, return the result
  if (response.ok) {
    // If the response is ok but there is no result, return null
    try {
      const result = (await response.json()) as T;
      return [null, result];
    } catch (error) {
      return [null, null];
    }
  }

  // If the response is not ok, try to get the error message from the response
  try {
    const result = await response.json();
    return [result.error, null];
  } catch (error) {
    // If the response is not ok and there is no error message, return a generic error message
    return ["Something went wrong", null];
  }
}
