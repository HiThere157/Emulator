type ApiResult<T> = null | {
  error?: string;
  result?: T;
};
