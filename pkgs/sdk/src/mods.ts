import { join } from 'path';
import fs from 'fs/promises';
import fsExists from 'fs.promises.exists';

import * as steam from './steam';
import * as servers from './server';
import { Config, ModConfigFiles } from './config';
import assert from 'assert';
import { assertIsManagerMode } from './mode';
import { createCppFileParser } from './cpp';


/**
 * Main Api
 */


/**
 * Downloads a mod to the workshop store
 */
export const addMod = async (modId: string) => {
  return await steam.authenticatedSteamCmd([
    `+workshop_download_item "${Config.get('CLIENT_APPID')}" "${modId}"`,
    '+quit',
  ]);
};

/**
 * Symlinks a downloaded mod to the servers mod store
 */
export const activateMod = async (serverId: string, modId: string) => {
  assertIsManagerMode()
  assertSteamStoreModExists(modId);

  const workshopModPath = getSteamStoreModPath(modId);
  const serverModPath = await getServerStoreModPath(serverId, modId);

  fs.link(workshopModPath, serverModPath);
};

/**
 * Unlinks a downloaded mod from a servers mod store
 */
export const deactivateMod = async (serverId: string, modId: string) => {
  assertIsManagerMode()
  const exists = await doesServerModExist(serverId, modId);
  if (!exists) {
    return;
  }

  const serverModPath = await getServerStoreModPath(serverId, modId);

  await fs.unlink(serverModPath);
};

/**
 * Removes a downloaded mod and unlinks it from all server mod stores
 */
export const removeMod = async (modId: string) => {
  assertIsManagerMode()
  const availableServers = await servers.getServerList();
  await Promise.all(
    availableServers.map(async (server) => {
      await deactivateMod(server.id, modId);
    }),
  );

  if (!(await doesSteamStoreModExist(modId))) {
    return;
  }

  const modPath = getSteamStoreModPath(modId);
  await fs.rmdir(modPath);
};

export const getModDetails = async (modId: string): Promise<ModeItemDetail> => {
  assertIsManagerMode()
  const modDetails = await getSteamStoreModMeta(modId);
  const modDir = await getSteamStoreModPath(modId);
  const modSize = await getDirSize(modDir)
  const customXML = await getCustomXML(modId);

  return {
    ...modDetails,
    size: modSize,
    customXML,
    path: modDir
  };
}

/**
 * Helpers
 */

export type ModItem = {
  id: string;
  name: string;
  path: string;
};

export type ModItemList = ModItem[];
export type ModeItemDetail = ModItem & {
  size: number;
  customXML: CustomXmlItem[];
};

export type CustomXmlItem = { name: string };



export const getCustomXML = async (modId: string) => {
  assertIsManagerMode()
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

import { z } from 'zod';
import { getDirSize } from './fs';

/**
 * Read the meta.cpp file
 */
const steamStoreModMetaParser = createCppFileParser(z.object({
  id: z.coerce.string(),
  name: z.string()
}))

export const getSteamStoreModMeta = async (modId: string) => {
  assertIsManagerMode()
  const metacpp = await getSteamStoreModFileContents(modId, 'meta.cpp');
  assert(metacpp, `Mod ${modId} does not have a meta.cpp file!`);

  const meta = await steamStoreModMetaParser(metacpp)

  if (meta.success) {
    return meta.data
  }

  throw new Error(`Parsing ModMeta ${modId} was not valid. ${meta.error}`);
};

export const listSteamStoreMods = async () => {
  const modDir = join(Config.get('STEAMSTORE_MODS'), Config.get('CLIENT_APPID'))
  const mods: ModItem[] = [];
  const modFiles = await fs.readdir(modDir, {
    withFileTypes: true,
  });

  for (const file of modFiles) {
    const meta = await getSteamStoreModMeta(file.name);
    if (!meta) {
      continue;
    }

    mods.push({ name: meta.name, id: file.name, path: file.parentPath });
  }

  return mods;
};


export const getServerModMeta = async (modId: string) => { }
export const listCurrentServerMods = async (serverId: string) => { }

/**
 * Retrieve a list of mods installed to a server
 */
export const listServerMods = async (serverId: string) => {
  assertIsManagerMode()
  const serverFiles = Config.get('SERVERSTORE_FILES');
  const path = join(serverFiles, serverId);

  const modFiles = await fs.readdir(path, {
    withFileTypes: true,
  });
  const mods: ModItem[] = [];

  for (const file of modFiles) {
    if (!file.isSymbolicLink() || !file.name.startsWith('@')) {
      continue;
    }
    const meta = await getSteamStoreModMeta(file.name);

    if (!meta) {
      continue;
    }

    mods.push({ name: meta.name, id: file.name, path: file.parentPath });
  }

  return mods;
};

/**
 * Server
 */

/**
 * Does the server have a mod?
 */
export async function doesServerModExist(serverId: string, modId: string) {
  const modPath = await getServerStoreModPath(serverId, modId);
  return await fsExists(modPath);
}
export async function assertServerModExists(serverId: string, modId: string) {
  const yesno = await doesServerModExist(serverId, modId);
  if (!yesno) {
    throw new Error(`"${serverId}" does not have mod "${modId}"`);
  }
}

export async function getServerStoreModPath(serverId: string, modId: string) {
  const modMeta = await getSteamStoreModMeta(modId);
  return join(Config.get('SERVERSTORE_MODS'), serverId, `@${modMeta.name}`);
}


/**
 * Steam Store
 */
/**
 *
 */
export async function getSteamStoreModFileContents(
  modId: string,
  filepath: string,
) {
  if (!(await doesSteamStoreModFileExist(modId, filepath))) {
    return null;
  }

  const modFilePath = getSteamStoreModFilePath(modId, filepath);
  const contents = await fs.readFile(modFilePath, { encoding: 'utf8' });
  return contents;
}
export function getSteamStoreModPath(modId: string) {
  assertIsManagerMode()
  const modDir = join(Config.get('STEAMSTORE_MODS'), Config.get('CLIENT_APPID'), modId)
  return modDir
}

export function getSteamStoreModFilePath(modId: string, filepath: string) {
  assertIsManagerMode()
  const modDir = getSteamStoreModPath(modId);
  return join(modDir, filepath);
}


export async function doesSteamStoreModExist(modId: string) {
  const modPath = getSteamStoreModPath(modId);
  return await fsExists(modPath);
}

export async function assertSteamStoreModExists(modId: string) {
  const yesno = await doesSteamStoreModExist(modId);
  if (!yesno) {
    throw new Error(`Mod ${modId} does not exist`);
  }
}

export async function doesSteamStoreModFileExist(
  modId: string,
  filepath: string,
) {
  const modFilePath = getSteamStoreModFilePath(modId, filepath);
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
