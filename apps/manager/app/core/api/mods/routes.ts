import sdk from '@dayzserver/sdk';
import {
  PublishedFileServiceQueryFilesRequestParamsSchema,
  DownloadModParametersSchema,
  InstallModParametersSchema,
  RemoveModParamtersSchema,
  UpdateModParametersSchema,
  GetModParametersSchema,
  GetModFileParametersSchema,
  GetServerModsParametersSchema,
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
export const getModList = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const output = await sdk.mods.listAllMods();
      const body = createResponseBody({
        code: ResponseCodes.ModListSuccess,
        data: { mods: output },
      });
      return body;
    } catch (error) {
      const body = createErrorResponseBody({
        code: ResponseCodes.ModListError,
        data: null,
        error: errorResponseBodyError(error),
      });
      return body;
    }
  },
);

/**
 * get a list of mods installed to a server
 */

export const getServerModList = createServerFn({
  method: 'GET',
})
  .validator(GetServerModsParametersSchema)
  .handler(async (context) => {
    const { serverId } = context.data;
    try {
      const output = await sdk.mods.listServerMods({ serverId });
      const body = createResponseBody({
        code: ResponseCodes.ServerModListSuccess,
        data: { mods: output },
      });
      return body;
    } catch (error) {
      const body = createErrorResponseBody({
        code: ResponseCodes.ModListError,
        error: errorResponseBodyError(error),
      });
      return body;
    }
  });

/**
 * Get mod metadata
 */
export const getModDetails = createServerFn({ method: 'GET' })
  .validator(GetModParametersSchema)
  .handler(async (context) => {
    const modId = context.data.modId;
    try {
      const modDetails = await sdk.mods.getMod({ modId });

      if (!modDetails) {
        throw new Error(ResponseCodes.ModNotFoundError);
      }

      const body = createResponseBody({
        data: modDetails,
        code: ResponseCodes.ModDetailSuccess,
      });

      return body;
    } catch (error) {
      if (error === ResponseCodes.ModFileNotFound) {
        const body = createErrorResponseBody({
          code: ResponseCodes.ModNotFoundError,
        });
        setResponseStatus(404);
        return body;
      }

      const body = createErrorResponseBody({
        code: ResponseCodes.ModDetailError,
        error: errorResponseBodyError(error),
      });
      setResponseStatus(500);
      return body;
    }
  });

/**
 * Get mod file data
 */
export const getModFileDetails = createServerFn({ method: 'GET' })
  .validator(GetModFileParametersSchema)
  .handler(async (context) => {
    const { modId, file } = context.data;
    try {
      const contents = await sdk.mods.getModFile({ modId, file });
      if (!contents) {
        throw new Error(ResponseCodes.ModFileNotFound);
      }
      const body = createResponseBody({
        code: ResponseCodes.ModFileFound,
        data: contents || '',
      });
      return body;
    } catch (error) {
      if (error === ResponseCodes.ModFileNotFound) {
        const body = createErrorResponseBody({
          code: ResponseCodes.ModFileNotFound,
        });
        setResponseStatus(404);
        return body;
      }

      const body = createErrorResponseBody({
        code: ResponseCodes.ModFileContentsError,
      });

      setResponseStatus(500);
      return body;
    }
  });

/**
 * Install a mod from steam
 */

export const downloadMod = createServerFn({ method: 'POST' })
  .validator(DownloadModParametersSchema)
  .handler(async (context) => {
    const { modId } = context.data;
    try {
      await sdk.mods.downloadMod({ modId });
      const body = createResponseBody({
        data: `Mod ${modId} installed successfully`,
        code: ResponseCodes.ModDownloadSuccess,
      });
      return body;
    } catch (err) {
      const body = createErrorResponseBody({
        code: ResponseCodes.ModInstallError,
        error: err as Error,
      });
      return body;
    }
  });

/**
 * Remove a mod from the server
 */
export const removeMod = createServerFn({ method: 'POST' })
  .validator(RemoveModParamtersSchema)
  .handler((context) => {
    const { modId } = context.data;

    const body = createResponseBody({
      code: ResponseCodes.ModRemovedSuccess,
      data: `Mod ${modId} removed successfully`,
    });

    return body;
  });

/**
 * Update a mod on the server
 */
export const updateMod = createServerFn({ method: 'POST' })
  .validator(UpdateModParametersSchema)
  .handler((context) => {
    const { modId } = context.data;

    const body = createResponseBody({
      code: ResponseCodes.ModUpdateSuccess,
      data: `Mod ${modId} updated successfully`,
    });

    return body;
  });

/**
 * Activate a mod on the server
 */
export const installModToServer = createServerFn({
  method: 'POST',
})
  .validator(InstallModParametersSchema)
  .handler(async (context) => {
    const { modId, serverId } = context.data;
    try {
      await sdk.mods.installModToServer({ serverId, modId });
      const body = createResponseBody({
        data: `Mod ${modId} installed to Server ${serverId} successfully`,
        code: ResponseCodes.ModInstallSuccess,
      });
      return body;
    } catch (err) {
      const body = createErrorResponseBody({
        code: ResponseCodes.ModInstallError,
        error: err as Error,
      });
      return body;
    }
  });

/**
 * Deactivate a mod on the server
 */
export const uninstallModFromServer = createServerFn({
  method: 'POST',
})
  .validator(InstallModParametersSchema)
  .handler(async (context) => {
    const { modId, serverId } = context.data;
    try {
      await sdk.mods.uninstallModFromServer({ serverId, modId });
      const body = createResponseBody({
        data: `Mod ${modId} uninstalled from Server ${serverId} successfully`,
        code: ResponseCodes.ModUninstallSuccess,
      });
      return body;
    } catch (err) {
      const body = createErrorResponseBody({
        code: ResponseCodes.ModUninstallError,
        error: err as Error,
      });
      return body;
    }
  });

/**
 * Search for mods
 */
export const searchWorkshop = createServerFn({ method: 'POST' })
  .validator(PublishedFileServiceQueryFilesRequestParamsSchema)
  .handler(async (context) => {
    try {
      const results = await sdk.mods.apiSearch(context.data);
      const body = createResponseBody({
        code: ResponseCodes.SearchQuerySuccess,
        data: results,
      });

      return body;
    } catch (error) {
      const body = createErrorResponseBody<
        string,
        ResponseCodes.SearchQueryError
      >({
        code: ResponseCodes.SearchQueryError,
        error:
          errorResponseBodyError(error) ??
          `Error searching for ${context.data.search_text}`,
      });

      setResponseStatus(500);
      return body;
    }
  });
