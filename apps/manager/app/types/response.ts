export enum GenericResponseCodes {
  Success = 'Success',
  Error = 'Error',
}

export type SuccessResponse<T = void, C = any> = {
  data: T;
  successCode: C;
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
export const isSuccessResponse = <T, C>(
  response: unknown,
): response is SuccessResponse<T, C> => {
  return !!response && typeof response === 'object' && 'successCode' in response;
};
