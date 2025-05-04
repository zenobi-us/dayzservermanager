import sdk, { Config } from '@dayzserver/sdk';
import * as codes from '@dayzserver/sdk/codes';
import { LoginParametersSchema } from '@dayzserver/sdk/schema';
import { createServerFn } from '@tanstack/react-start';

import {
  createErrorResponseBody,
  createResponseBody,
  errorResponseBodyError,
} from '../../response';

export const login = createServerFn({ method: 'POST' })
  .validator(LoginParametersSchema)
  .handler(async (context) => {
    try {
      const username = await sdk.auth.login(context.data);
      return createResponseBody({
        data: { username },
      });
    } catch (error) {
      const body = createErrorResponseBody({
        code: codes.auth.LoginFailed,
        error: errorResponseBodyError(error),
      });

      return body;
    }
  });

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  try {
    await sdk.auth.logout();
    return createResponseBody({});
  } catch (error) {
    const body = createErrorResponseBody({
      code: codes.auth.LogoutFailed,
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
    });
    return Promise.resolve(body);
  } catch (error) {
    const body = createErrorResponseBody({
      code: codes.auth.GetAuthenticatedUserError,
      error: errorResponseBodyError(error),
    });
    return Promise.resolve(body);
  }
});
