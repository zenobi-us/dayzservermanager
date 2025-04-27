import sdk from '@dayzserver/sdk';
import { PublishedFileServiceQueryFilesRequestParamsSchema } from '@dayzserver/sdk/schema';
import { createServerFn } from '@tanstack/react-start';
import { setHeader, setResponseStatus } from '@tanstack/react-start/server';
import { z } from 'zod';

import {
  createErrorResponseBody,
  createResponseBody,
  errorResponseBodyError,
} from '../../response';

import type { ErrorResponse, SuccessResponse } from '@/types/response';

import { ResponseCodes } from './codes';

import type { SteamWorkshopSearchResults } from '@dayzserver/sdk/schema';
import type { Fetcher } from '@tanstack/react-start';

/**
 * Create a list of mods
 */
const getModList = createServerFn({ method: 'GET' }).handler(async () => {
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
});

/**
 * Get mod metadata
 */
const GetModDetailsParametersSchema = z.object({
  modId: z.string(),
});
const getModDetails = createServerFn({ method: 'GET' })
  .validator((data: unknown) => GetModDetailsParametersSchema.parse(data))
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
          data: null,
        });
        setResponseStatus(404);

        return body;
      }

      const body = createErrorResponseBody({
        data: `Error parsing mod ${modId}`,
        code: ResponseCodes.ModParsingError,
      });

      setResponseStatus(500);
      return body;
    }
  });

/**
 * Get mod file data
 */

const GetModFileDetailsParametersSchema = z.object({
  modId: z.string(),
  file: z.string(),
});
const getModFileDetails = createServerFn({ method: 'GET' })
  .validator((data: unknown) => GetModFileDetailsParametersSchema.parse(data))
  .handler(async (context) => {
    const { modId, file } = context.data;
    try {
      const contents = await sdk.mods.getModFile({ modId, file });

      if (!contents) {
        const body = createErrorResponseBody({
          code: ResponseCodes.ModFileNotFound,
        });
        setResponseStatus(404);

        return body;
      }

      // context.set("content-type", "application/xml");
      setHeader('Content-Type', 'application/xml');
      return contents;
    } catch {
      const body = createErrorResponseBody({
        code: ResponseCodes.ModFileContentsError,
        data: 'An error occurred while fetching the mod file',
      });
      setResponseStatus(500);

      return body;
    }
  });

/**
 * Install a mod from steam
 */
type InstallModFn = Fetcher<
  undefined,
  typeof InstallModParametersSchema,
  | SuccessResponse<string, ResponseCodes.ModInstallSuccess>
  | ErrorResponse<{}, ResponseCodes.ModInstallError>,
  'data'
>;
const InstallModParametersSchema = z.object({
  modId: z.string(),
});
const installMod: InstallModFn = createServerFn({ method: 'POST' })
  .validator(InstallModParametersSchema)
  .handler(async (context) => {
    const { modId } = context.data;
    try {
      await sdk.mods.addMod({ modId });
      const body = createResponseBody({
        data: `Mod ${modId} installed successfully`,
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
 * Remove a mod from the server
 */
const RemoveModParametersSchema = z.object({
  modId: z.string(),
});
const removeMod = createServerFn({ method: 'POST' })
  .validator((data: unknown) => RemoveModParametersSchema.parse(data))
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
const UpdateModParametersSchema = z.object({
  modId: z.string(),
});
const updateMod = createServerFn({ method: 'POST' })
  .validator((data: unknown) => UpdateModParametersSchema.parse(data))
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
const ActivateModParametersSchema = z.object({
  modId: z.string(),
});
const activateMod = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ActivateModParametersSchema.parse(data))
  .handler((context) => {
    const { modId } = context.data;

    const body = createResponseBody({
      code: ResponseCodes.ModActivatedSuccess,
      data: `Mod ${modId} activated successfully`,
    });

    return body;
  });

/**
 * Deactivate a mod on the server
 */
const DeActivateModParametersSchema = z.object({
  modId: z.string(),
});
const deactivateMod = createServerFn({ method: 'POST' })
  .validator((data: unknown) => DeActivateModParametersSchema.parse(data))
  .handler((context) => {
    const { modId } = context.data;

    const body = createResponseBody({
      code: ResponseCodes.ModDeactivatedSuccess,
      data: `Mod ${modId} deactivated successfully`,
    });

    return body;
  });

/**
 * Search for mods
 */
type SearchWorkshopFn = Fetcher<
  undefined,
  typeof PublishedFileServiceQueryFilesRequestParamsSchema,
  | SuccessResponse<
      SteamWorkshopSearchResults,
      ResponseCodes.SearchQuerySuccess
    >
  | ErrorResponse<string, ResponseCodes.SearchQueryError>,
  'data'
>;

export const searchWorkshop: SearchWorkshopFn = createServerFn()
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

export {
  deactivateMod,
  activateMod,
  updateMod,
  removeMod,
  installMod,
  getModFileDetails,
  getModDetails,
  getModList,
};
