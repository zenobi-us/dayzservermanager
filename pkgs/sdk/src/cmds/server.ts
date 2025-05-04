import fs from 'fs/promises';
import { join } from 'path';

import { snakeCase } from 'lodash-es';
import template from 'lodash-es/template';

import {
  ServerConfigInvalidError,
  ServerConfigParseError,
  ServerContainerNotFoundError,
  ServerContainerRemoveError,
  ServerContainerRestartError,
  ServerContainerStartError,
  ServerContainerStopError,
} from '../errors/server';
import { createCppFileParser } from '../lib/cpp';
import { dockerClient } from '../lib/docker';
import { ServerConfigSchema } from '../schema/serverSchema';

import { Config } from './config';
import { assertIsManagerMode } from './mode';
import { listModsAtPath, listServerMods } from './mods';

import type {
  CreateServerPayload,
  Server,
  ServerConfig,
} from '../schema/serverSchema';

/**
 * Main
 */
/**
 * Get a list of servers
 *
 * @scope manager
 */
export async function getServerList() {
  assertIsManagerMode();

  const serverFiles = Config.get('SERVERSTORE_FILES');
  const servers = await fs.readdir(serverFiles, {
    withFileTypes: true,
  });
  const output: Server[] = [];

  for (const entry of servers) {
    if (!entry.isDirectory()) {
      continue;
    }
    const server = await getServerDetail({ serverId: entry.name });

    if (!server) {
      continue;
    }

    output.push(server);
  }

  return output;
}

/**
 * Get details of a server
 *
 * @scope manager
 */
export async function getServerDetail({ serverId }: { serverId: string }) {
  assertIsManagerMode();

  const id = serverId;
  const path = join(createServerStorePath(serverId), serverId);
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

  let container:
    | Awaited<ReturnType<typeof getServerContainerInfo>>
    | undefined = undefined;
  try {
    container = await getServerContainerInfo({ serverId });
  } catch {
    //
  }

  const mods = await listServerMods({
    serverId,
  });

  const output: Server = {
    id: serverId,
    path,
    mods,
    map: config.template,
    config,
    container,
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
  assertIsManagerMode();

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

  // create container
  // label it

  await createServerContainer({ serverId: formattedServerId });

  const server = await getServerDetail({ serverId: formattedServerId });

  return Promise.resolve(server);
}

export async function getServerContainerInfo({
  serverId,
}: {
  serverId: string;
}) {
  const containers = await dockerClient.listContainers({
    all: true,
  });
  const containerInfo = containers.find((container) => {
    return container.Labels[Config.get('CONTAINER_SERVERLABEL')] === serverId;
  });

  if (!containerInfo) {
    throw new ServerContainerNotFoundError();
  }

  const container = dockerClient.getContainer(containerInfo?.Id);

  return await container.inspect();
}

const containerNameTmpl = template(Config.get('CONTAINER_SERVERNAME_TMPL'), {
  interpolate: /\{\{(.+?)\}\}/g,
});

export async function createServerContainer({
  serverId,
}: {
  serverId: string;
}) {
  const serverImage = Config.get('CONTAINER_SERVERIMAGE');
  const serverLabel = Config.get('CONTAINER_SERVERLABEL');
  const containerName = containerNameTmpl({ serverId });

  try {
    const container = await dockerClient.createContainer({
      name: containerName,
      Image: serverImage,
      Labels: {
        [serverLabel]: serverId,
      },
      Volumes: {
        '/home/user': {},
        '/store/steam': {},
        '/store/serverstore': {},
        '/store/severmissions': {},
        '/store/serverprofiles': {},
        '/store/servermods': {},
      },
      HostConfig: {
        Mounts: [
          {
            Type: 'volume',
            Source: 'homes',
            Target: '/home/user',
            VolumeOptions: {
              NoCopy: true,
              DriverConfig: {
                Name: '',
                Options: {},
              },
              Labels: {},
              Subpath: serverId,
            },
          },
          {
            Type: 'volume',
            Source: 'serverstore',
            Target: '/store/serverstore',
            VolumeOptions: {
              NoCopy: true,
              DriverConfig: {
                Name: '',
                Options: {},
              },
              Labels: {},
              Subpath: serverId,
            },
          },
        ],
      },
    });

    return container;
  } catch {
    //
  }

  return null;
}

export async function startServerContainer({ serverId }: { serverId: string }) {
  const containerInfo = await getServerContainerInfo({ serverId });
  if (!containerInfo) {
    throw new ServerContainerNotFoundError();
  }

  try {
    const container = dockerClient.getContainer(containerInfo?.Id);
    const inspection = await container.inspect();

    if (
      inspection.State.Running ||
      inspection.State.Paused ||
      inspection.State.Restarting
    ) {
      return;
    }

    await container.start();

    return container;
  } catch (error) {
    throw new ServerContainerStartError({
      serverId,
      error: error instanceof Error ? error : undefined,
    });
  }
}

export async function removeServerContainer({
  serverId,
}: {
  serverId: string;
}) {
  const containerInfo = await getServerContainerInfo({ serverId });
  if (!containerInfo) {
    throw new ServerContainerNotFoundError();
  }

  const container = dockerClient.getContainer(containerInfo?.Id);

  await stopServerContainer({ serverId });

  try {
    await container.remove();

    return container;
  } catch (error) {
    throw new ServerContainerRemoveError({
      serverId,
      error: error instanceof Error ? error : undefined,
    });
  }
}
export async function restartServerContainer({
  serverId,
}: {
  serverId: string;
}) {
  const containerInfo = await getServerContainerInfo({ serverId });
  if (!containerInfo) {
    throw new ServerContainerNotFoundError();
  }

  try {
    const container = dockerClient.getContainer(containerInfo?.Id);
    const inspection = await container.inspect();
    if (inspection.State.Restarting) {
      return;
    }

    if (!inspection.State.Running || !inspection.State.Paused) {
      return;
    }

    await container.restart();

    return container;
  } catch (error) {
    throw new ServerContainerRestartError({
      serverId,
      error: error instanceof Error ? error : undefined,
    });
  }
}

export async function stopServerContainer({ serverId }: { serverId: string }) {
  const containerInfo = await getServerContainerInfo({ serverId });
  if (!containerInfo) {
    throw new ServerContainerNotFoundError();
  }

  try {
    const container = dockerClient.getContainer(containerInfo?.Id);
    const inspection = await container.inspect();

    if (
      !inspection.State.Running ||
      !inspection.State.Paused ||
      !inspection.State.Restarting
    ) {
      return;
    }

    await container.stop();

    return container;
  } catch (error) {
    throw new ServerContainerStopError({
      serverId,
      error: error instanceof Error ? error : undefined,
    });
  }
}

/**
 * Helpers
 */

export async function getServerModCommandArgs({
  serverId,
}: {
  serverId?: string;
}) {
  const modfilesPath = serverId
    ? join(Config.get('SERVERFILES_MODS'), serverId)
    : Config.get('SERVERSTORE_MODS');

  const modList = await listModsAtPath({ path: modfilesPath });

  return modList
    .map((mod) => {
      return mod.identifier;
    })
    .join(';');
}

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
  const serverPath = createServerStorePath(serverId);
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

export function createServerStorePath(serverId: string) {
  const serverFiles = Config.get('SERVERSTORE_FILES');
  return join(serverFiles, serverId);
}
