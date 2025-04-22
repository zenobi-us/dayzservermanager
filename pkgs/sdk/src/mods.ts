import { join } from "path";
import fs from "fs/promises";
import fsExists from "fs.promises.exists";
import { z } from 'zod'

import * as steam from "./steam";
import * as servers from './server';
import { Config, ModConfigFiles } from "./config";
import assert from "assert";

export type ModItem = {
  id: string;
  name: string;
};

export type ModItemList = ModItem[];
export type ModeItemDetail = {
  id: string;
  name: string;
  size: number;
  customXML: CustomXmlItem[];
}

export type CustomXmlItem = { name: string };



export const getCustomXML = async (modId: string) => {
  const output: CustomXmlItem[] = [];
  const exists = await fsExists(Config.get('WORKSHOP_DIR'));

  if (!exists) {
    return output;
  }

  const configFilePaths = ModConfigFiles.map(async (file) => {
    if (!doesWorkshopModFileExist(modId, file)) {
      return;
    }

    output.push({ name: file });
  });

  await Promise.all(configFilePaths);

  return output;
};

/**
 * Read the meta.cpp file 
 */
const MetaCPPNameLinePattern = /^name\s?=(?<name>.*);?/
export const getModMeta  = async (modId:string) => {
  const metacpp = await getWorkshopModFileContents(modId, 'meta.cpp')
  assert(metacpp, `Mod ${modId} does not have a meta.cpp file!`)

  const name = null;
  const lines = metacpp.split('\n')
  
  for (const line of lines) {
    if (!line.includes('name')) {
      continue
    }
    const matches = MetaCPPNameLinePattern.exec(line)
    if (!matches || !matches.groups) { continue }
    if ("name" in matches.groups && !matches?.groups.name) {
      return matches.groups.name
    }
  }

  throw new Error(`Mod ${modId} has a meta.cpp, but there's no name field.`)
}

export const getModNameById = async (id: string) => {
  const files = await fs.readdir(Config.get('WORKSHOP_DIR'), {
    encoding: "utf8",
    withFileTypes: true,
  });

  for (const file of files) {
    const filepath = join(Config.get('WORKSHOP_DIR'), file.name);

    if (!fsExists(filepath)) {
      continue;
    }

    const sym = await fs.readlink(filepath);

    if (sym.indexOf(id) < 0) {
      continue;
    }

    return file.name;
  }

  return null
};

export const getAllWorkshopMods = async () => {
  const workshopDir = Config.get('WORKSHOP_DIR')
  const mods: ModItem[] = [];
  const modDirExists = await fsExists(workshopDir);

  if (!modDirExists) {
    return mods;
  }

  const modFiles = await fs.readdir(workshopDir);
  
  for (const file of modFiles) {
    const name = await getModNameById(file);
    if (!name) {
      continue
    }

    mods.push({ name, id: file });
  }

  return mods;
};

/**
 * Retrieve a list of mods for a particular server.
 */
export const getModsWithServerId = async (serverId: string) => {
  assert(Config.get("MODE") !== 'manager', 'Only to be used in manager mode')
  const serverFiles = join(Config.get('SERVER_FILES'), serverId)
  return getServerModsFromPath(serverFiles)
}

/**
 * Retrieve a list of mods on this server.
 */
export const getCurrentServerMods = async () => {
  assert(Config.get("MODE") !== 'server', 'Only to be used in server mode')
  const serverFiles = Config.get('SERVER_FILES')
  return getServerModsFromPath(serverFiles)
}

/**
 * Return a list of mods installed for a server at a path
 * 
 * This can be used by both manager and server since we mount the paths like so:
 *  volumes:
 *    ServerFilesVolume:
 * 
 *  manager:
 *    image: dayzserver:manager-local
 *    volumes:
 *      - ServerFilesVolume:/store/serverFiles
 * 
 *  serverOne:
 *    image: dayzserver:manager-local
 *    volumes:
 *      - type: volume
 *        source: ServerFilesVolume
 *        target: /store/serverFiles
 *        subpath: serverOne
 * 
 */
export const getServerModsFromPath = async (path: string) => {
  const modFiles = await fs.readdir(path, {
    withFileTypes: true
  })
  const mods: ModItem[] = [];

  for (const file of modFiles) {
    if (!file.isSymbolicLink() || !file.name.startsWith('@')) {
      continue
    }
    const name = await getModNameById(file.name);
    if (!name) {
      continue
    }

    mods.push({ name, id: file.name})
  }

  return mods
}

/**
 * Downloads a mod to the workshop store
 */
export const addMod = async (modId:string) => {
  return await steam.authenticatedSteamCmd([
    `+workshop_download_item "${Config.get('CLIENT_APPID')}" "${modId}"`,
    '+quit'
  ])
}

/**
 * Symlinks a downloaded mod to the servers mod store
 */
export const activateMod = async(serverId:string, modId: string) => {
  assertWorkshopModExists(modId);

  const workshopModPath = createWorkshopModPath(modId);
  const serverModPath = await createServerModPath(serverId, modId);

  fs.link(workshopModPath, serverModPath)
}

/**
 * Unlinks a downloaded mod from a servers mod store
 */
export const deactivateMod = async (serverId:string, modId:string) => {
  const exists = await doesServerModExist(serverId, modId)
  if (!exists) {
    return
  }

  const serverModPath = await createServerModPath(serverId, modId);
  fs.unlink(serverModPath)
}

/**
 * Removes a downloaded mod and unlinks it from all server mod stores
 */
export const removeMod = async (modId:string) => {
  
  const availableServers = await servers.getServerList()
  await Promise.all(availableServers
    .map(async (server) => {
      deactivateMod(server.id, modId)
    }))
    
  if (!doesWorkshopModExist(modId)) {
    return
  }

  const modPath = createWorkshopModPath(modId)
  await fs.rmdir(modPath)
}

/**
 * 
 */
export async function getWorkshopModFileContents(modId: string, filepath: string) {
  
  if (!(await doesWorkshopModFileExist(modId, filepath))) {
    return null;
  }

  const modFilePath = createWorkshopModFilePath(modId, filepath);
  const contents = await fs.readFile(modFilePath, { encoding: "utf8" });
  return contents;
}

export async function doesWorkshopModExist(modId: string) {
  const modPath = createWorkshopModPath(modId);
  return await fsExists(modPath);
}

export async function assertWorkshopModExists(modId: string) {
  const yesno = await doesWorkshopModExist(modId);
  if (!yesno) {
    throw new Error(`Mod ${modId} does not exist`)
  }
}


export async function doesWorkshopModFileExist(modId: string, filepath: string) {
  const modFilePath = await createWorkshopModFilePath(modId, filepath);
  return await fsExists(modFilePath);
}
export async function assertWorkshopModFileExists(modId: string, filepath: string) {
  const yesno = await doesWorkshopModFileExist(modId, filepath);
  if (!yesno) {
    throw new Error(`Either Mod ${modId} does not exist, or it does not have a file at ${filepath}`)
  }
}
export async function doesServerModExist(serverId:string, modId:string) {
  const modPath = await createServerModPath(serverId, modId);
  return await fsExists(modPath)
}

export async function assertServerModExists(serverId:string, modId:string) {
  const yesno = await doesServerModExist(serverId, modId);
  if (!yesno) {
    throw new Error(`"${serverId}" does not have mod "${modId}"`)
  }
}

export function createWorkshopModPath(modId: string) {
  return join(Config.get('WORKSHOP_DIR'), modId);
}

export async function createServerModPath(serverId: string, modId: string) {
  const modName = await getModNameById(modId);
  return join(Config.get('SERVER_FILES'), serverId, `@${modName}`);
}

export function createWorkshopModFilePath(modId: string, filepath:string) {
  return join(Config.get('WORKSHOP_DIR'), modId, filepath);
}