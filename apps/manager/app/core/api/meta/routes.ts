import sdk from '@dayzserver/sdk';
import * as codes from '@dayzserver/sdk/codes';
import { createServerFn } from '@tanstack/react-start';

import { createErrorResponseBody, createResponseBody } from '../../response';

/**
 * Get the status of things:
 * - If the base files are installed,
 * - the version of the server,
 * - the appid (If release or experimental)
 */
export const getServerMeta = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const status = await sdk.meta.getMetaStatus();
      const body = createResponseBody({
        data: status,
      });
      return body;
    } catch (error) {
      const body = createErrorResponseBody({
        code: codes.meta.ServerStatusError,
        data: error instanceof Error ? error : 'Something went wrong.',
      });
      return body;
    }
  },
);
