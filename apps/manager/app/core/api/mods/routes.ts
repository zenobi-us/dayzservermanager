import { createServerFn } from '@tanstack/react-start';
import { setHeader, setResponseStatus } from '@tanstack/react-start/server';
import sdk from '@dayzserver/sdk';
import type { ModeItemDetail } from '@dayzserver/sdk';

import { createErrorResponseBody, createResponseBody } from '../../response';
import * as fs from '../../fs';
import { ModListResponseCodes } from './codes';
import { z } from 'zod';
/**
 * Create a list of mods
 */
const getModList = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const output = await sdk.mods.getAllWorkshopMods();
    const body = createResponseBody({
      code: ModListResponseCodes.ModListSuccess,
      data: { mods: output },
    });
    return body;
  } catch {
    const body = createErrorResponseBody({
      code: ModListResponseCodes.ModListError,
      data: null,
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
    const modDir = sdk.mods.createWorkshopModPath(modId);
    try {
      const customXML = await sdk.mods.getCustomXML(modId);
      const name = await sdk.mods.getModNameById(modId);

      if (!name) {
        throw ModListResponseCodes.ModNotFoundError;
      }

      const detail: ModeItemDetail = {
        id: modId,
        path: modDir,
        name,
        size: fs.getDirSize(modDir),
        customXML,
      };

      const body = createResponseBody({
        data: detail,
        code: ModListResponseCodes.ModDetailSuccess,
      });

      return body;
    } catch (error) {
      if (error === ModListResponseCodes.ModFileNotFound) {
        const body = createErrorResponseBody({
          code: ModListResponseCodes.ModNotFoundError,
          data: null,
        });
        setResponseStatus(404);

        return body;
      }

      const body = createErrorResponseBody({
        data: `Error parsing mod ${modId}`,
        code: ModListResponseCodes.ModParsingError,
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
      const contents = await sdk.mods.getWorkshopModFileContents(modId, file);

      if (!contents) {
        const body = createErrorResponseBody({
          code: ModListResponseCodes.ModFileNotFound,
        });
        setResponseStatus(404);

        return body;
      }

      // context.set("content-type", "application/xml");
      setHeader('Content-Type', 'application/xml');
      return contents;
    } catch {
      const body = createErrorResponseBody({
        code: ModListResponseCodes.ModFileContentsError,
        data: 'An error occurred while fetching the mod file',
      });
      setResponseStatus(500);

      return body;
    }
  });

/**
 * Install a mod from steam
 */
const InstallModParametersSchema = z.object({
  modId: z.string(),
});
const installMod = createServerFn({ method: 'POST' })
  .validator((data: unknown) => InstallModParametersSchema.parse(data))
  .handler((context) => {
    const { modId } = context.data;

    const body = createResponseBody({
      data: `Mod ${modId} installed successfully`,
      code: ModListResponseCodes.ModInstallSuccess,
    });

    return body;
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
      code: ModListResponseCodes.ModRemovedSuccess,
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
      code: ModListResponseCodes.ModUpdateSuccess,
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
      code: ModListResponseCodes.ModActivatedSuccess,
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
      code: ModListResponseCodes.ModDeactivatedSuccess,
      data: `Mod ${modId} deactivated successfully`,
    });

    return body;
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
