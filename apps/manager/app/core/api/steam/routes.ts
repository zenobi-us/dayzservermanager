import sdk from '@dayzserver/sdk';

import { ResponseCodes } from './codes';
import { z } from 'zod';
import { createErrorResponseBody, createResponseBody, errorResponseBodyError } from '../../response';
import { ErrorResponse, SuccessResponse } from '@/types/response';
import { createServerFn, Fetcher } from '@tanstack/react-start';


const LoginParametersSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginFn = Fetcher<
  undefined,
  typeof LoginParametersSchema,
  SuccessResponse<{}, ResponseCodes.LoginSuccess> | ErrorResponse<{}, ResponseCodes.LoginFailed>,
  'data'
>;

export const login: LoginFn = createServerFn({ method: 'POST' })
  .validator(LoginParametersSchema)
  .handler(async (context) => {
    try {
      await sdk.steam.login(context.data);
      return createResponseBody({
        code: ResponseCodes.LoginSuccess
      })
    } catch (error) {
      const body = createErrorResponseBody({
        code: ResponseCodes.LoginFailed,
        error: errorResponseBodyError(error)
      })

      return body
    }
  });
