import assert from 'assert';
import fs from 'fs/promises';
import https from 'https';
import { join } from 'path';

import fsExists from 'fs.promises.exists';
import { startCase } from 'lodash-es';
import { z } from 'zod';

import * as errors from '../errors';
import { createCppFileParser } from '../lib/cpp';
import { getDirSize } from '../lib/fs';
import { ModConfigFiles } from '../schema/configSchema';
import {
  EPublishedFileQueryType,
  SteamWorkshopSearchResultsSchema,
} from '../schema/modsSchema';

import { Config } from './config';
import { assertIsManagerMode } from './mode';
import * as servers from './server';
import * as steamcmds from './steamcmds';

import type {
  CustomXmlItem,
  IPublishedFileServiceQueryFilesRequestParams,
  ModItemDetail,
  SteamWorkshopSearchResults,
} from '../schema/modsSchema';

/**
 * Main Api
 */

/**
 * https://partner.steamgames.com/doc/webapi/IPublishedFileService#QueryFiles
 */
export const apiSearch = async (
  params: IPublishedFileServiceQueryFilesRequestParams,
) => {
  assertIsManagerMode();
  const url = createSearchUrl(params);

  return new Promise<SteamWorkshopSearchResults>((resolve, reject) => {
    https
      .get(url, (resp) => {
        let data = '';
        const onEnd = async () => {
          try {
            const result = JSON.parse(data);
            const parsed =
              await SteamWorkshopSearchResultsSchema.safeParseAsync(result);
            if (parsed.success) {
              resolve(parsed.data);
            } else {
              console.error(
                'Failed to parse steam search results',
                parsed.error,
              );
              reject(new Error('Failed to parse steam search results'));
            }
          } catch (err) {
            reject(
              err instanceof Error
                ? err
                : typeof err === 'string'
                  ? new Error(err)
                  : new Error('Something unknown occured'),
            );
          }
        };

        resp.on('data', (chunk) => {
          data += chunk;
        });

        resp.on('end', () => {
          onEnd().catch(console.error);
        });
      })
      .on('error', (err) => {
        console.log(err.message);
        reject(err);
      });
  });
};

/**
 * Get mod details for a downloaded mod
 */
export const getMod = async ({ modId }: { modId: string }) => {
  assertIsManagerMode();
  await assertSteamStoreModExists({ modId });

  const modPath = getSteamStoreModPath({ modId });
  return await getModDetails({ path: modPath });
};

/**
 * Get contents of a mod file
 */
export const getModFile = async ({
  modId,
  file,
}: {
  modId: string;
  file: string;
}) => {
  assertIsManagerMode();
  await assertSteamStoreModExists({ modId });

  const modPath = getSteamStoreModPath({ modId });
  const filepath = join(modPath, file);
  return await getModFileContents({ filepath });
};

/**
 * Downloads a mod to the workshop store
 */
export const downloadMod = async ({ modId }: { modId: string }) => {
  assertIsManagerMode();
  return await steamcmds.authenticatedSteamCmd([
    `+workshop_download_item "${Config.get('CLIENT_APPID')}" "${modId}"`,
    '+quit',
  ]);
};

/**
 * Symlinks a downloaded mod to the servers mod store
 */
export const installModToServer = async ({
  serverId,
  modId,
}: {
  serverId: string;
  modId: string;
}) => {
  assertIsManagerMode();
  const workshopModPath = getSteamStoreModPath({ modId });
  const modMeta = await getModMeta({ path: workshopModPath });
  const targetPath = getServerStoreModItemPath({
    serverId,
    modName: modMeta.name,
  });

  if (!(await fsExists(workshopModPath))) {
    throw new errors.mods.ModNoExistsError();
  }
  if (await fsExists(targetPath)) {
    throw new errors.mods.InstallModAlreadyExistsError();
  }

  await fs.symlink(workshopModPath, targetPath);
};

/**
 * Unlinks a downloaded mod from a servers mod store
 */
export const uninstallModFromServer = async ({
  serverId,
  modId,
}: {
  serverId: string;
  modId: string;
}) => {
  assertIsManagerMode();
  const workshopModPath = getSteamStoreModPath({ modId });
  const modMeta = await getModMeta({ path: workshopModPath });
  const serverModPath = getServerStoreModItemPath({
    serverId,
    modName: modMeta.name,
  });

  if (!(await fsExists(serverModPath))) {
    throw new errors.mods.InstallModNoExistsError();
  }

  await fs.unlink(serverModPath);
};

/**
 * Removes a downloaded mod and unlinks it from all server mod stores
 */
export const removeMod = async ({ modId }: { modId: string }) => {
  assertIsManagerMode();
  const availableServers = await servers.getServerList();
  await Promise.all(
    availableServers.map(async (server) => {
      await uninstallModFromServer({ serverId: server.id, modId });
    }),
  );

  const modPath = getSteamStoreModPath({ modId });
  if (!(await fsExists(modPath))) {
    return;
  }

  await fs.rmdir(modPath);
};

/**
 * Get a list of all downloaded mods
 */
export const listAllMods = async () => {
  assertIsManagerMode();
  const modStorePath = join(
    Config.get('STEAMSTORE_MODS'),
    Config.get('CLIENT_APPID'),
  );
  const mods = await listModsAtPath({ path: modStorePath });
  return mods;
};

/**
 * Get a list of all downloaded mods
 */
export const listServerMods = async ({ serverId }: { serverId: string }) => {
  assertIsManagerMode();
  const modStorePath = join(Config.get('SERVERSTORE_MODS'), serverId);
  return await listModsAtPath({ path: modStorePath });
};

/**
 * Helpers
 */

export const getCustomXML = async (modId: string) => {
  assertIsManagerMode();
  const output: CustomXmlItem[] = [];

  const configFilePaths = ModConfigFiles.map(async (file) => {
    const exists = await doesSteamStoreModFileExist(modId, file);
    if (!exists) {
      return;
    }

    output.push({ name: file });
  });

  await Promise.all(configFilePaths);

  return output;
};

export const getModDetails = async ({
  path,
}: {
  path: string;
}): Promise<ModItemDetail> => {
  const modDetails = await getModMeta({ path });
  const modSize = getDirSize(path);
  const customXML = await getCustomXML(path);
  const identifier = getServerModIdentifier(modDetails.name);

  return {
    ...modDetails,
    name: startCase(modDetails.name),
    identifier,
    size: modSize,
    customXML,
    path,
  };
};

/**
 * Read the meta.cpp file
 */
const modMetaParser = createCppFileParser(
  z.object({
    id: z.coerce.string(),
    name: z.string(),
  }),
);

export const getModMeta = async ({ path }: { path: string }) => {
  const modFilePath = join(path, 'meta.cpp');
  const metacpp = await getModFileContents({ filepath: modFilePath });
  assert(metacpp, `Mod ${path} does not have a meta.cpp file!`);

  const meta = await modMetaParser(metacpp);

  if (meta.success) {
    return meta.data;
  }

  throw new Error(
    `Parsing ModMeta ${path} was not valid. ${meta.error.toString()}`,
  );
};

export async function listModsAtPath({ path }: { path: string }) {
  const modFiles = await fs.readdir(path, {
    withFileTypes: true,
  });
  const mods: ModItemDetail[] = [];

  for (const file of modFiles) {
    const modPath = join(path, file.name);
    const meta = await getModDetails({ path: modPath });

    if (!meta) {
      continue;
    }

    mods.push(meta);
  }

  return mods;
}

/**
 * Server
 */

/**
 * Does the server have a mod?
 */
export async function doesServerModItemExist({
  serverId,
  modName,
}: {
  serverId: string;
  modName: string;
}) {
  const modPath = getServerStoreModItemPath({ serverId, modName });
  return await fsExists(modPath);
}
export async function assertServerModExists({
  serverId,
  modName,
}: {
  serverId: string;
  modName: string;
}) {
  const yesno = await doesServerModItemExist({ serverId, modName });
  if (!yesno) {
    throw new Error(`"${serverId}" does not have mod "${modName}"`);
  }
}

export function getServerStoreModItemPath({
  serverId,
  modName,
}: {
  serverId: string;
  modName: string;
}) {
  return join(
    Config.get('SERVERSTORE_MODS'),
    serverId,
    getServerModIdentifier(modName),
  );
}

export function getServerStoreModListPath({ serverId }: { serverId: string }) {
  return join(Config.get('SERVERSTORE_MODS'), serverId);
}

export function getServerModIdentifier(modName: string) {
  return `@${startCase(modName).replace(/\s/gim, '')}`;
}
/**
 * Steam Store
 */
/**
 *
 */
export async function getModFileContents({ filepath }: { filepath: string }) {
  if (!(await fsExists(filepath))) {
    return null;
  }
  const contents = await fs.readFile(filepath, { encoding: 'utf8' });
  return contents;
}

export function getSteamStoreModPath({ modId }: { modId: string }) {
  const modDir = join(
    Config.get('STEAMSTORE_MODS'),
    Config.get('CLIENT_APPID'),
    modId,
  );
  return modDir;
}

export function getSteamStoreModFilePath({
  modId,
  filepath,
}: {
  modId: string;
  filepath: string;
}) {
  const modDir = getSteamStoreModPath({ modId });
  return join(modDir, filepath);
}

export async function doesSteamStoreModExist({ modId }: { modId: string }) {
  const modPath = getSteamStoreModPath({ modId });
  return await fsExists(modPath);
}

export async function assertSteamStoreModExists({ modId }: { modId: string }) {
  const yesno = await doesSteamStoreModExist({ modId });
  if (!yesno) {
    throw new Error(`Mod ${modId} does not exist`);
  }
}

export async function doesSteamStoreModFileExist(
  modId: string,
  filepath: string,
) {
  const modFilePath = getSteamStoreModFilePath({ modId, filepath });
  return await fsExists(modFilePath);
}

export async function assertSteamStoreModFileExists(
  modId: string,
  filepath: string,
) {
  const yesno = await doesSteamStoreModFileExist(modId, filepath);
  if (!yesno) {
    throw new Error(
      `Either Mod ${modId} does not exist, or it does not have a file at ${filepath}`,
    );
  }
}

const createSearchUrl = ({
  search_text,
  page = 1,
  numperpage = 10,
  ...options
}: IPublishedFileServiceQueryFilesRequestParams) => {
  const appid = Config.get('CLIENT_APPID');
  const key = Config.get('STEAM_APIKEY');

  if (!key) {
    throw new Error(
      'Missing STEAM_APIKEY. Get yours from https://steamcommunity.com/dev/apikey',
    );
  }

  const url = new URL(
    'https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/',
  );
  const cleaned = Object.fromEntries(
    Object.entries(options)
      .filter((item) => item[1] !== undefined)
      .map((key, value) => [key, value.toString()]),
  );
  const params = new URLSearchParams({
    ...cleaned,
    search_text,
    page,
    numperpage,
    return_metadata: true,
    return_reactions: true,
    return_short_description: true,
    query_type: EPublishedFileQueryType.RankedByTextSearch,
    appid,
    key,
  });

  url.search = params.toString();
  return url.toString();
};
