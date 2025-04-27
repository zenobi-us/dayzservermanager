import fs from 'fs/promises';
import { join } from 'path';

import { snakeCase } from 'lodash-es';

import { ServerConfigInvalidError, ServerConfigParseError } from '../errors';
import { createCppFileParser } from '../lib/cpp';
import { ServerConfigSchema } from '../schema/serverSchema';

import { Config } from './config';
import { assertIsManagerMode } from './mode';

import type { ModItem } from '../schema/modsSchema';
import type {
  CreateServerPayload,
  Server,
  ServerConfig,
} from '../schema/serverSchema';

export async function getServerList() {
  const serverFiles = Config.get('SERVERSTORE_FILES');
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
    if (
      error instanceof Error ||
      error instanceof ServerConfigInvalidError ||
      error instanceof ServerConfigParseError
    ) {
      return {
        id,
        path,
        error,
      };
    }

    return {
      id,
      path,
      error: new Error(),
    };
  }

  const output: Server = {
    id: serverId,
    path,
    mods: [],
    map: config.template,
    config,
    error: null,
  };

  return output;
}

const ServerConfigTemplate = ({ template, ...data }: ServerConfig) => `
  ${Object.entries(data)
    .map(([key, value]) => `${key} = ${value};`)
    .join('\n')}

  class Mission {
    template = ${template};
  }
`;

export async function createServer(details: CreateServerPayload) {
  const formattedServerId = snakeCase(details.hostname);

  const serverFiles = join(Config.get('SERVERSTORE_FILES'), formattedServerId);
  const serverMods = join(Config.get('SERVERSTORE_MODS'), formattedServerId);

  await fs.mkdir(serverFiles);
  await fs.mkdir(serverMods);

  const serverConfigData = await getServerConfig({
    path: join(Config.get('FILES'), Config.get('SERVER_CONFIG_FILENAME')),
  });

  await saveServerConfig(
    formattedServerId,
    ServerConfigTemplate({
      ...serverConfigData,
      hostname: formattedServerId,
    }),
  );

  const server = await getServerDetail(formattedServerId);

  return Promise.resolve(server);
}

/**
 * Return a mod list suitable to be used for
 * dayz modlist args
 */
export async function getServerModCommandArgs() {
  const serverFiles = Config.get('SERVERFILES_MODS');
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
const serverConfigParser = createCppFileParser(ServerConfigSchema);

export async function getServerStoreConfig(serverId: string) {
  assertIsManagerMode();

  const configFileName = Config.get('SERVER_CONFIG_FILENAME');
  const serverStoreFiles = Config.get('SERVERSTORE_FILES');
  const filename = join(serverStoreFiles, serverId, configFileName);
  return await getServerConfig({ path: filename });
}

export async function getServerConfig({ path }: { path: string }) {
  const content = await fs.readFile(path, { encoding: 'utf-8' });
  const output = await serverConfigParser(content);

  if (!output.success) {
    const error = output.error;
    throw new ServerConfigInvalidError(error);
  }

  return output.data;
}

/**
 * Write the provided server config to <serverId>/serverDZ.cfg.save
 */
export async function saveServerConfig(serverId: string, config: string) {
  const serverPath = createServerPath(serverId);
  await fs.writeFile(
    join(serverPath, Config.get('SERVER_CONFIG_FILENAME')),
    config,
  );

  return;
}

/**
 * Parse the <serverId>/serverDZ.cfg for template=(.*)
 */
export async function getServerMapName(serverId: string) {
  const config = await getServerStoreConfig(serverId);
  if (!config) {
    return null;
  }

  return config.template;
}

export function createServerPath(serverId: string) {
  const serverFiles = Config.get('SERVERSTORE_FILES');
  return join(serverFiles, serverId);
}
