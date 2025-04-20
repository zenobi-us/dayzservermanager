enum GenericResponseCodes {
  Success = "Success",
  Error = "Error",
}

export function createResponseBody<T>(
  {
    data,
    code,
  }: {
    data?: T;
    code?: string;
  } = {
    data: 'Success' as T,
    code: GenericResponseCodes.Success,
  }
) {
  return {
    data: data,
    success: {
      code: code,
    },
  };
}

export function createErrorResponseBody<T>({
  data,
  code,
}: {
  data?: T;
  code?: string;
} = {
  data: 'Error' as T,
  code: GenericResponseCodes.Error,
}) {
  return {
    data,
    error: {
      code,
    },
  };
}
