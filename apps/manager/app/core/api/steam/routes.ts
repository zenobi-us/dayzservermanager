import sdk, { Config } from '@dayzserver/sdk';
import { LoginParametersSchema } from '@dayzserver/sdk/schema';
import { createServerFn } from '@tanstack/react-start';

import {
  createErrorResponseBody,
  createResponseBody,
  errorResponseBodyError,
} from '../../response';

import { ResponseCodes } from './codes';

export const login = createServerFn({ method: 'POST' })
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

export const getAuthenticatedUser = createServerFn({
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
