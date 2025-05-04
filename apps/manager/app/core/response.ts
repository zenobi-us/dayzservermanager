import type { ErrorResponse, SuccessResponse } from '../types/response';

enum GenericResponseCodes {
  Success = 'Success',
  Error = 'Error',
}

export function createResponseBody<T = {}>({
  data,
}: {
  data?: T;
}): SuccessResponse<T> {
  return {
    data: data || ({} as T),
  };
}

export function createErrorResponseBody<
  T = {},
  C extends string = GenericResponseCodes.Error,
>({
  data,
  error,
  code,
}: {
  data?: T;
  code?: C;
  error?: Error | string;
}): ErrorResponse<T, C> {
  return {
    data: data || ({} as T),
    error,
    errorCode: code || (GenericResponseCodes.Error as C),
  };
}

export function errorResponseBodyError(error: unknown) {
  return error instanceof Error
    ? error
    : typeof error === 'string'
      ? error
      : undefined;
}
