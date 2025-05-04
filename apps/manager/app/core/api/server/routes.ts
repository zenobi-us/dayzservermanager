import sdk from '@dayzserver/sdk';
import * as codes from '@dayzserver/sdk/codes';
import {
  CreateServerContainerPayloadSchema,
  CreateServerPayloadSchema,
  GetServerDetailParamsSchema,
  RemoveServerContainerPayloadSchema,
} from '@dayzserver/sdk/schema';
import { createServerFn } from '@tanstack/react-start';
import { setResponseStatus } from '@tanstack/react-start/server';

import {
  createErrorResponseBody,
  createResponseBody,
  errorResponseBodyError,
} from '../../response';

/**
 * Create a list of mods
 */
export const updateServerBaseFiles = createServerFn({ method: 'POST' }).handler(
  async () => {
    try {
      await sdk.auth.useCachedLogin();
    } catch (error) {
      const body = createErrorResponseBody({
        code: codes.auth.LoginFailed,
        error: errorResponseBodyError(error),
      });

      setResponseStatus(401);

      return body;
    }

    const body = createResponseBody({});

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
      });
      return body;
    } catch (error) {
      const body = createErrorResponseBody({
        code: codes.server.ServerListError,
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
      });
      return body;
    } catch (error) {
      const body = createErrorResponseBody({
        code: codes.server.ServerListError,
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
      });
    } catch (error) {
      return createErrorResponseBody({
        code: codes.server.CreateServerError,
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
      if (!container) {
        throw new Error();
      }

      return createResponseBody({
        data: {
          containerId: container.id,
        },
      });
    } catch (error) {
      return createErrorResponseBody({
        code: codes.server.CreateServerContainerError,
        error: errorResponseBodyError(error),
      });
    }
  });

/**
 * Start Server Container
 */
export const startServerContainer = createServerFn({ method: 'POST' })
  .validator(CreateServerContainerPayloadSchema)
  .handler(async ({ data }) => {
    try {
      await sdk.server.startServerContainer(data);
      const containerInfo = await sdk.server.getServerContainerInfo(data);

      return createResponseBody({
        data: {
          containerId: containerInfo.Id,
        },
      });
    } catch (error) {
      return createErrorResponseBody({
        code: codes.server.CreateServerContainerError,
        error: errorResponseBodyError(error),
      });
    }
  });

/**
 * Stop Server Container
 */

export const stopServerContainer = createServerFn({ method: 'POST' })
  .validator(CreateServerContainerPayloadSchema)
  .handler(async ({ data }) => {
    try {
      await sdk.server.stopServerContainer(data);
      const containerInfo = await sdk.server.getServerContainerInfo(data);

      return createResponseBody({
        data: {
          containerId: containerInfo.Id,
        },
      });
    } catch (error) {
      return createErrorResponseBody({
        code: codes.server.StopServerContainerError,
        error: errorResponseBodyError(error),
      });
    }
  });

/**
 * Restart Server Container
 */

export const restartServerContainer = createServerFn({ method: 'POST' })
  .validator(CreateServerContainerPayloadSchema)
  .handler(async ({ data }) => {
    try {
      await sdk.server.restartServerContainer(data);
      const containerInfo = await sdk.server.getServerContainerInfo(data);

      return createResponseBody({
        data: {
          containerId: containerInfo.Id,
        },
      });
    } catch (error) {
      return createErrorResponseBody({
        code: codes.server.RestartServerContainerError,
        error: errorResponseBodyError(error),
      });
    }
  });

/**
 * Remove a container
 */
export const removeServerContainer = createServerFn({ method: 'POST' })
  .validator(RemoveServerContainerPayloadSchema)
  .handler(async ({ data }) => {
    try {
      await sdk.server.removeServerContainer(data);
      return createResponseBody({});
    } catch (error) {
      return createErrorResponseBody({
        code: codes.server.CreateServerContainerError,
        error: errorResponseBodyError(error),
      });
    }
  });
