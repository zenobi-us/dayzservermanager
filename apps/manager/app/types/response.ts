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
  response: object,
): response is ErrorResponse<T, C> => {
  return !!response && 'errorCode' in response;
};
export const isSuccessResponse = <T, C>(
  response: object,
): response is SuccessResponse<T, C> => {
  return !!response && 'successCode' in response;
};
