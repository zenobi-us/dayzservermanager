import sdk from '@dayzserver/sdk';
import { createServerFn } from '@tanstack/react-start';

import { createResponseBody } from '../../response';

import { ResponseCodes } from './codes';

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
        code: ResponseCodes.ServerBaseFilesUpdateSuccess,
      });
      return body;
    } catch (error) {
      const body = createResponseBody({
        code: ResponseCodes.ServerStatusError,
        data: error instanceof Error ? error : 'Something went wrong.',
      });
      return body;
    }
  },
);
