import sdk from '@dayzserver/sdk';
import {
  CreateServerContainerPayloadSchema,
  CreateServerPayloadSchema,
  GetServerDetailParamsSchema,
} from '@dayzserver/sdk/schema';
import { createServerFn } from '@tanstack/react-start';
import { setResponseStatus } from '@tanstack/react-start/server';

import {
  createErrorResponseBody,
  createResponseBody,
  errorResponseBodyError,
} from '../../response';

import { ResponseCodes } from './codes';

/**
 * Create a list of mods
 */
export const updateServerBaseFiles = createServerFn({ method: 'POST' }).handler(
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
export const getAllServers = createServerFn({ method: 'GET' }).handler(
  async () => {
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
  },
);

/**
 * Provide a list of all the servers
 */

export const getServerDetail = createServerFn({ method: 'GET' })
  .validator(GetServerDetailParamsSchema)
  .handler(async ({ data }) => {
    try {
      const server = await sdk.server.getServerDetail({
        serverId: data.serverId,
      });
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

export const createServer = createServerFn({ method: 'POST' })
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

/**
 * Create Server Container
 */
export const createServerContainer = createServerFn({ method: 'POST' })
  .validator(CreateServerContainerPayloadSchema)
  .handler(async ({ data }) => {
    try {
      const container = await sdk.server.createServerContainer(data);
      return createResponseBody({
        data: {
          containerId: container.id,
        },
        code: ResponseCodes.CreateServerContainerSuccess,
      });
    } catch (error) {
      return createErrorResponseBody({
        code: ResponseCodes.CreateServerContainerError,
        error: errorResponseBodyError(error),
      });
    }
  });
