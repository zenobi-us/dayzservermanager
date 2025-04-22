import fs from "fs/promises";
import { Config } from "./config";
import * as mods from "./mods";
import { join } from "path";
import { z } from "zod";

export type Server = {
  id: string;
  path: string;
  map: string;
  mods?: mods.ModItemList
  config: ServerConfig
};

export async function getServerList() {
  const serverFiles = Config.get("SERVER_FILES");
  const servers = await fs.readdir(serverFiles, {
    withFileTypes: true,
  });
  const output: Server[] = [];

  for (const entry of servers) {
    if (!entry.isDirectory()) {
      continue;
    }
    const server = await getServerDetail(entry.name);

    output.push(server);
  }

  return output;
}

export async function getServerDetail(serverId: string) {
  const config = await getServerConfig(serverId);
  const serverPath = createServerPath(serverId)
  const output:Server = {
    id: serverId,
    path: serverPath,
    mods: [],
    map: config.template,
    config
  }

  return output
}

/**
 * Return a mod list suitable to be used for
 * dayz modlist args
 */
export async function getServerModCommandArgs() {
  const activeMods = await mods.getCurrentServerMods();

  return activeMods.reduce((result, mod) => {
    return (result += `${mod.id};`);
  }, "-mod=");
}



export async function getServerFile(serverId: string, filename: string) {
  const serverFiles = Config.get("SERVER_FILES");
  const filepath = join(serverFiles, serverId, filename);

  return await fs.readFile(filepath, { encoding: "utf8" });
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
const ServerConfigParameterPattern =
  /^(?!\/\/)\s+(?<key>\w+)\s*=\s*(?<value>[^;]*);/gm;

export async function getServerConfig(serverId: string) {
  const configFileName = Config.get("SERVER_CONFIG_FILENAME");
  const content = await getServerFile(serverId, configFileName);
  const data: Record<string, string | number> = {};
  let match;
  while ((match = ServerConfigParameterPattern.exec(content)) !== null) {
    if (!match.groups) {
      continue;
    }
    const key = match.groups.key;
    const value = JSON.parse(match.groups.value.trim());
    data[key] = value;
  }

  const output =  ServerConfigSchema.parse(data);

  return output
}

const ServerConfigBooleanEnum = z.union([z.literal(0), z.literal(1), z.literal(2)])

const ServerConfigSchema = z.object({
  maxPlayers: z.number().default(60),
  verifySignatures: ServerConfigBooleanEnum.default(1),
  forceSameBuild: ServerConfigBooleanEnum.default(0),
  disableVoN: ServerConfigBooleanEnum.default(1),
  disable3rdPerson: ServerConfigBooleanEnum.default(1),
  serverTime: z.string(),
  serverTimePersistent: ServerConfigBooleanEnum.default(1),
  guaranteedUpdates: ServerConfigBooleanEnum.default(1),
  loginQueueConcurrentPlayers: z.number().default(5),
  instanceId: z.number(),
  respawnTime: z.number().default(0),
  timeStampFormat: z.union([z.literal('Short'), z.literal('Long')]),
  adminLogPlayerHitsOnly: ServerConfigBooleanEnum.default(0),
  enableDebugMonitor: ServerConfigBooleanEnum.default(0),
  steamQueryPort: z.number().default(27016),
  allowFilePatching: ServerConfigBooleanEnum.default(1),
  simulatedPlayersBatch: z.number().default(20),
  multithreadedReplication: ServerConfigBooleanEnum.default(0),
  speedhackDetection: ServerConfigBooleanEnum.default(1),
  networkRangeClose: z.number().default(20),
  defaultVisibility: z.number().default(1375),
  lightingConfig: ServerConfigBooleanEnum.default(1),
  disableBaseDamage: ServerConfigBooleanEnum.default(0),
  lootHistory: ServerConfigBooleanEnum.default(1),
  enableCfgGameplayFile: ServerConfigBooleanEnum.default(1),
  vppDisablePassword: ServerConfigBooleanEnum.default(0),
  template: z.string(),
});
export type ServerConfig = z.infer<typeof ServerConfigSchema>

/**
 * Write the provided server config to <serverId>/serverDZ.cfg.save
 */
export function saveServerConfig(serverId: string, config: string) {}

/**
 * Parse the <serverId>/serverDZ.cfg for template=(.*)
 */
export async function getServerMapName(serverId: string) {
  const config = await getServerConfig(serverId);
  if (config.template) {
    return config.template
  }

  throw new Error(`Server ${serverId} has no configured map`);
}

export function createServerPath(serverId: string) {
  const serverFiles = Config.get("SERVER_FILES");
  return join(serverFiles, serverId);
}