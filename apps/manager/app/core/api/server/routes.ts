import { createServerFn } from '@tanstack/react-start';
import sdk from '@dayzserver/sdk';
import { setResponseStatus } from '@tanstack/react-start/server';

import {
  createErrorResponseBody,
  createResponseBody,
  errorResponseBodyError,
} from '../../response';
import { ResponseCodes } from './codes';
import { z } from 'zod';

/**
 * Create a list of mods
 */
const updateServerBaseFiles = createServerFn({ method: 'POST' }).handler(
  async () => {
    try {
      await sdk.steam.useCachedLogin();
    } catch (error) {
      const body = createErrorResponseBody({
        code: ResponseCodes.LoginFailed,
        error: errorResponseBodyError(error),
      });

      setResponseStatus(401);

      return body;
    }

    const body = createResponseBody({
      code: ResponseCodes.ServerBaseFilesUpdateSuccess,
    });

    return body;
  },
);

/**
 * Provide a list of all the servers
 */
const getAllServers = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const servers = await sdk.server.getServerList();
    const body = createResponseBody({
      data: { servers },
      code: ResponseCodes.ServerListSuccess,
    });
    return body;
  } catch (error) {
    const body = createErrorResponseBody({
      code: ResponseCodes.ServerListError,
      error: error instanceof Error ? error : undefined,
    });
    setResponseStatus(500);
    return body;
  }
});

/**
 * Provide a list of all the servers
 */
const GetServerDetailParams = z.object({
  serverId: z.string(),
});
const getServerDetail = createServerFn({ method: 'GET' })
  .validator((data: { serverId: string }) => GetServerDetailParams.parse(data))
  .handler(async ({ data }) => {
    try {
      const server = await sdk.server.getServerDetail(data.serverId);
      const body = createResponseBody({
        data: { server },
        code: ResponseCodes.ServerListSuccess,
      });
      return body;
    } catch (error) {
      const body = createErrorResponseBody({
        code: ResponseCodes.ServerListError,
        error: error instanceof Error ? error : undefined,
      });
      setResponseStatus(500);
      return body;
    }
  });

export { updateServerBaseFiles, getAllServers, getServerDetail };
