import fs from "fs/promises";
import { Config } from "./config";
import * as mods from "./mods";
import { join } from "path";
import { ServerConfigInvalidError, ServerConfigParseError, ServerFileNotFound } from "./errors";
import { ServerConfig, ServerConfigSchema } from "./serverSchema";
import { assertIsManagerMode, assertIsServerMode } from "./mode";
import { createCppFileParser } from "./cpp";
import { ModItem } from "./mods";


export type ServerBase = {
  id: string;
  path: string;
}

export type Server = ServerBase & (
  ServerWithDetails | ServerWithParseError | ServerWithInvalidConfig
)

export type ServerWithDetails = {
  map: string;
  mods?: mods.ModItemList;
  config: ServerConfig;
  error: null;
};

export type ServerWithParseError = {
  error: ServerConfigParseError;
};

export type ServerWithGenericError = {
  error: Error
};

export type ServerWithInvalidConfig = {
  error: ServerConfigInvalidError
};

export async function getServerList() {
  const serverFiles = Config.get("SERVERSTORE_FILES");
  const servers = await fs.readdir(serverFiles, {
    withFileTypes: true,
  });
  const output: Server[] = [];

  for (const entry of servers) {
    if (!entry.isDirectory()) {
      continue;
    }
    const server = await getServerDetail(entry.name);

    if (!server) {
      continue;
    }

    output.push(server);
  }

  return output;
}

export async function getServerDetail(serverId: string): Promise<Server> {

  const id = serverId;
  const path = join(createServerPath(serverId), serverId);
  let config = {} as ServerConfig;

  try {
    config = await getServerStoreConfig(serverId);

  } catch (error) {
    if (error instanceof Error || error instanceof ServerConfigInvalidError || error instanceof ServerConfigParseError) {
      return {
        id,
        path,
        error
      }
    }

    return {
      id,
      path,
      error: new Error
    }
  }


  const output: Server = {
    id: serverId,
    path,
    mods: [],
    map: config.template,
    config,
    error: null
  }

  return output
}

/**
 * Return a mod list suitable to be used for
 * dayz modlist args
 */
export async function getServerModCommandArgs() {
  const serverFiles = Config.get('SERVERFILES_MODS')
  const modFiles = await fs.readdir(serverFiles, {
    withFileTypes: true,
  });

  const mods: ModItem[] = [];

  for (const file of modFiles) {
    if (!file.isSymbolicLink() || !file.name.startsWith('@')) {
      continue;
    }

    mods.push({ name: 'todo: get name', id: file.name, path: file.parentPath });
  }

  return mods;

}


/**

^: Start of line.
(?!\/\/): Ensures line doesn't start with // (comments).
\s*: allow an amount of white space
(?<key>\w+): Captures key (e.g., hostname).
\s*=\s*: allow whitespace around the =.
(?<value>[^;]*): Captures value (e.g., "Faceroll") up to ;.
;: Matches ending semicolon.
/gm: g for all matches, m for multiline.

 */
const serverConfigParser = createCppFileParser(ServerConfigSchema)

export async function getServerStoreConfig(serverId: string) {
  assertIsManagerMode()

  const configFileName = Config.get("SERVER_CONFIG_FILENAME");
  const serverStoreFiles = Config.get('SERVERSTORE_FILES')
  const filename = join(serverStoreFiles, serverId, configFileName)
  const content = await fs.readFile(filename, { encoding: 'utf-8' });
  const output = await serverConfigParser(content);

  if (!output.success) {
    const error = output.error
    throw new ServerConfigInvalidError(error)
  }

  return output.data;
}


/**
 * Write the provided server config to <serverId>/serverDZ.cfg.save
 */
export function saveServerConfig(serverId: string, config: string) { }

/**
 * Parse the <serverId>/serverDZ.cfg for template=(.*)
 */
export async function getServerMapName(serverId: string) {
  const config = await getServerStoreConfig(serverId);
  if (!config) {
    return null
  }

  return config.template
}

export function createServerPath(serverId: string) {
  const serverFiles = Config.get("SERVERFILES");
  return join(serverFiles, serverId);
}