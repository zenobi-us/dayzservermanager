import sdk, { Config } from '@dayzserver/sdk';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

import {
  createErrorResponseBody,
  createResponseBody,
  errorResponseBodyError,
} from '../../response';

import type { ErrorResponse, SuccessResponse } from '@/types/response';

import { ResponseCodes } from './codes';

import type { Fetcher } from '@tanstack/react-start';

const LoginParametersSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginFn = Fetcher<
  undefined,
  typeof LoginParametersSchema,
  | SuccessResponse<{ username: string }, ResponseCodes.LoginSuccess>
  | ErrorResponse<{}, ResponseCodes.LoginFailed>,
  'data'
>;

export const login: LoginFn = createServerFn({ method: 'POST' })
  .validator(LoginParametersSchema)
  .handler(async (context) => {
    try {
      const username = await sdk.auth.login(context.data);
      return createResponseBody({
        data: { username },
        code: ResponseCodes.LoginSuccess,
      });
    } catch (error) {
      const body = createErrorResponseBody({
        code: ResponseCodes.LoginFailed,
        error: errorResponseBodyError(error),
      });

      return body;
    }
  });

type GetAuthenticatedUserFn = Fetcher<
  undefined,
  undefined,
  | SuccessResponse<
      { username: string },
      ResponseCodes.GetAuthenticatedUserSuccess
    >
  | ErrorResponse<{}, ResponseCodes.GetAuthenticatedUserError>,
  'data'
>;

export const getAuthenticatedUser: GetAuthenticatedUserFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const username = Config.get('steamUsername');
    const body = createResponseBody({
      data: { username },
      code: ResponseCodes.GetAuthenticatedUserSuccess,
    });
    return Promise.resolve(body);
  } catch (error) {
    const body = createErrorResponseBody({
      code: ResponseCodes.GetAuthenticatedUserError,
      error: errorResponseBodyError(error),
    });
    return Promise.resolve(body);
  }
});
