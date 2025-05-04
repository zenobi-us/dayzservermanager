export enum GenericResponseCodes {
  Error = 'Error',
}

export type SuccessResponse<T = void> = {
  data: T;
};

export type ErrorResponse<T = void, C = any> = {
  data?: T;
  error?: Error | string;
  errorCode: C;
};

export const isErrorResponse = <T, C>(
  response: unknown,
): response is ErrorResponse<T, C> => {
  return !!response && typeof response === 'object' && 'errorCode' in response;
};
export const isSuccessResponse = <T>(
  response: unknown,
): response is SuccessResponse<T> => {
  return (
    !!response &&
    typeof response === 'object' &&
    !('errorCode' in response) &&
    !('error' in response)
  );
};
