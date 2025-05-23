import { z } from 'zod';

export const EnvConfigSchema = z.object({
  MODE: z
    .union([z.literal('server'), z.literal('manager'), z.null()])
    .default(null),
  /*
     Without a release binary, we must use the experimental server app ID.
     */
  SERVER_APPID: z.string().default('1042420'),

  /*
    DayZ release client Steam app ID. This is for mods, as only the release client has them.
    */
  CLIENT_APPID: z.string().default('221100'),

  /**
   * Where should steam download the mods
   */
  STEAMSTORE: z.string().default('/store/steam'),
  STEAMSTORE_MODS: z.string().default('/store/steam/workshop/content'),

  /**
   * All servers files
   */
  FILES: z.string().default('/store/files'),
  SERVERSTORE_FILES: z.string().default('/store/serverfiles'),
  SERVERSTORE_MODS: z.string().default('/store/servermods'),
  SERVERSTORE_MISSIONS: z.string().default('/store/servermissions'),
  SERVERSTORE_PROFILES: z.string().default('/store/serverprofiles'),

  /**
   * Server specific paths.
   * Only usable if MODE === 'server'
   */
  SERVERFILES: z.string().default('/serverfiles'),
  SERVERFILES_MODS: z.string().default('/serverfiles/mods'),
  SERVERFILES_MISSIONS: z.string().default('/serverfiles/mpmissions'),
  SERVERFILES_PROFILES: z.string().default('/serverfiles/profiles'),

  CONTAINER_SERVERLABEL: z.string().default('dayzdocker-server'),
  CONTAINER_SERVERIMAGE: z.string().default('dayzserver:server-local'),
  CONTAINER_SERVERNAME_TMPL: z
    .string()
    .default('dayzdocker-server-{{serverId}}'),

  /**
   * The server config file name.
   *
   * Each server will have a file like this.
   */
  SERVER_CONFIG_FILENAME: z.string().default('serverDZ.cfg'),
  /**
   * What is the cmd we run to start the game server
   *
   * - SERVERFILES/:serverid/SERVER_COMMAND
   */
  SERVER_COMMAND: z.string().default('DayZServer'),
  /**
   * Extra mod files to map
   */
  MOD_CONFIGFILE_MAP: z.string().transform((value) => value.split(',')),
  /**
   * Extra DB files to map
   */
  DB_CONFIGFILE_MAP: z.string().transform((value) => value.split(',')),
  /**
   * Extran environment files to map
   */
  ENV_CONFIGFILE_MAP: z.string().transform((value) => value.split(',')),
  /**
   * Extra root files to map
   */
  ROOT_CONFIGFILE_MAP: z.string().transform((value) => value.split(',')),
  /**
   * Searching steam workshop requires an apikey
   *
   * - https://steamcommunity.com/dev/apikey
   */
  STEAM_APIKEY: z.string().optional(),
  /**
   * How we communicate with docker. can be any valid value docker accepts here
   * - /var/run/docker.sock
   * - https://...
   * - http://...
   *
   * https://github.com/apocas/docker-modem/blob/d5407c3ece1c13ee6f81632c737bc16ff75015b7/lib/modem.js#L16
   */
  DOCKER_HOST: z.string().default('/var/run/docker.sock'),
});

export type IEnvConfig = z.infer<typeof EnvConfigSchema>;

const FileConfigSchema = z.object({
  steamUsername: z.string(),
});

export type IFileConfig = z.infer<typeof FileConfigSchema>;

export const ConfigSchema = z
  .object({})
  .merge(EnvConfigSchema)
  .merge(FileConfigSchema);

export type IConfig = z.infer<typeof ConfigSchema>;

export const ServerVersionTypes = {
  experimental: '1042420',
  release: '223350',
};

/*
     XML config files the system can handle. These are retrieved from values in templates located in /files/mods/:modId
     */
export const ModConfigFiles = [
  'cfgeventspawns.xml',
  'cfgspawnabletypes.xml',
  'events.xml',
  'types.xml',
];

export const DbConfigFiles = [
  // global server config and core loot economy files
  'events.xml', // dynamic events
  'globals.xml', // global settings
  'messages.xml', // server broadcast messages and shutdown
  'types.xml', // loot table
];

export const EnvironmentConfigFiles = [
  // coordinates, static and dynamic spawns for each entity
  'cattle_territories.xml',
  'domestic_animals_territories.xml',
  'hare_territories.xml',
  'hen_territories.xml',
  'pig_territories.xml',
  'red_deer_territories.xml',
  'roe_deer_territories.xml',
  'sheep_goat_territories.xml',
  'wild_boar_territories.xml',
  'wolf_territories.xml',
  'zombie_territories.xml',
];
export const RootConfigFiles = [
  'cfgeconomycore.xml', // loot economy core settings and extensions
  'cfgeffectarea.json', // static contaminated area coordinates and other properties
  'cfgenvironment.xml', // includes env\* files and parameters
  'cfgeventgroups.xml', // definitions of groups of objects that spawn together in a dynamic event
  'cfgeventspawns.xml', // coordinates where events may occur
  'cfggameplay.json', // gameplay configuration settings.
  'cfgIgnoreList.xml', //  list of items that won’t be loaded from the storage
  'cfglimitsdefinition.xml', // list of valid categories, tags, usageflags and valueflags
  'cfglimitsdefinitionuser.xml', // shortcut groups of usageflags and valueflags
  'cfgplayerspawnpoints.xml', // new character spawn points
  'cfgrandompresets.xml', // collection of groups of items
  'cfgspawnabletypes.xml', // loot categorization (ie hoarder) as well as set of items that spawn as cargo or as attachment on weapons, vehicles or infected.
  'cfgundergroundtriggers.json', // used for triggering light and sounds in the Livonia bunker, not used for Chernarus
  'cfgweather.xml', // weather configuration
  'init.c', // mission startup file (PC only)
  'map*.xml',
  'mapgroupproto.xml', // structures, tags, maxloot and lootpoints
  'mapgrouppos.xml', // all valid lootpoints
];

// From https://helpthedeadreturn.wordpress.com/2019/07/17/dayz-sa-mission-file
export const ConfigFiles = {
  mod: ModConfigFiles,
  db: DbConfigFiles,
  env: EnvironmentConfigFiles,
  root: RootConfigFiles,
};
