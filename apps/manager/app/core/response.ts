import { ErrorResponse, SuccessResponse } from '../types/response';

enum GenericResponseCodes {
  Success = 'Success',
  Error = 'Error',
}

export function createResponseBody<
  T = {},
  C extends string = GenericResponseCodes.Success,
>({ data, code }: { data?: T; code?: C }): SuccessResponse<T, C> {
  return {
    data: data || ({} as T),
    successCode: code || (GenericResponseCodes.Success as C),
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
