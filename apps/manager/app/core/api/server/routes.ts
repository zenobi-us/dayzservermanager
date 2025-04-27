import sdk from '@dayzserver/sdk';
import { CreateServerPayloadSchema } from '@dayzserver/sdk/schema';
import { createServerFn } from '@tanstack/react-start';
import { setResponseStatus } from '@tanstack/react-start/server';
import { z } from 'zod';

import {
  createErrorResponseBody,
  createResponseBody,
  errorResponseBodyError,
} from '../../response';

import type { ErrorResponse, SuccessResponse } from '@/types/response';

import { ResponseCodes } from './codes';

import type { Server } from '@dayzserver/sdk/schema';
import type { Fetcher } from '@tanstack/react-start';

/**
 * Create a list of mods
 */
const updateServerBaseFiles = createServerFn({ method: 'POST' }).handler(
  async () => {
    try {
      await sdk.auth.useCachedLogin();
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
type GetServerDetailFn = Fetcher<
  undefined,
  typeof GetServerDetailParamsSchema,
  | SuccessResponse<{ server: Server }, ResponseCodes.ServerListSuccess>
  | ErrorResponse<{}, ResponseCodes.ServerListError>,
  'data'
>;
const GetServerDetailParamsSchema = z.object({
  serverId: z.string(),
});
const getServerDetail: GetServerDetailFn = createServerFn({ method: 'GET' })
  .validator(GetServerDetailParamsSchema)
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

/**
 * Create a server
 */
type CreateServerFn = Fetcher<
  undefined,
  typeof CreateServerPayloadSchema,
  | SuccessResponse<{ server: Server }, ResponseCodes.CreateServerSuccess>
  | ErrorResponse<Error, ResponseCodes.CreateServerError>,
  'data'
>;

const postCreateServer: CreateServerFn = createServerFn({ method: 'POST' })
  .validator(CreateServerPayloadSchema)
  .handler(async ({ data }) => {
    try {
      const server = await sdk.server.createServer(data);
      return createResponseBody({
        data: { server },
        code: ResponseCodes.CreateServerSuccess,
      });
    } catch (error) {
      return createErrorResponseBody({
        code: ResponseCodes.CreateServerError,
        error: errorResponseBodyError(error),
      });
    }
  });

export {
  updateServerBaseFiles,
  getAllServers,
  getServerDetail,
  postCreateServer,
};
