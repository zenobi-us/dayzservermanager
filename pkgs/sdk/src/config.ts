import { z } from 'zod';
import nconf from 'nconf';
import fs from 'fs/promises';

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
  STEAM_STORE: z.string().default('/store/steam'),

  /**
   * Where are we writing server specific files?
   *
   * This entry is used to create other paths:
   *
   * - a server root: SERVER_FILES/:serverid/
   * - a server mod: SERVER_FILES/:serverid/@:mod_name/ (a symlink)
   */
  SERVER_FILES: z.string().default('/store/serverfiles'),
  SERVER_MODS: z.string().default('/store/servermods'),
  SERVER_MISSIONS: z.string().default('/store/servermissions'),
  SERVER_PROFILES: z.string().default('/store/serverprofiles'),

  /**
   * The server config file name.
   *
   * Each server will have a file like this.
   */
  SERVER_CONFIG_FILENAME: z.string().default('serverDZ.cfg'),
  /**
   * What is the cmd we run to start the game server
   *
   * - SERVER_FILES/:serverid/SERVER_COMMAND
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
   * Searching steam workshop requires an apikey: https://steamcommunity.com/dev/apikey
   */
  STEAM_APIKEY: z.string().optional(),
  /**
   * Search url template
   */
  STEAM_SEARCH_URL_TEMPLATE: z
    .string()
    .default(
      'https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/?numperpage=1000&appid=221100&return_short_description=true&strip_description_bbcode=true&key={{api_key}}&search_text={{search_text}}',
    ),
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

const store = nconf.env().file({ file: 'dayzserver.config.json' });

export const Config = {
  get<T extends keyof IConfig>(key: T) {
    if (!Object.hasOwn(ConfigSchema.shape, key)) {
      throw new Error(`Missing ${key} from config.`);
    }

    const field = ConfigSchema.shape[key];
    return field.parse(store.get(key)) as IConfig[T];
  },
  save() {
    store.save(async function () {
      const data = await fs.readFile('dayzserver.config.json');
      console.dir(JSON.parse(data.toString()));
    });
  },
  set<T extends keyof IFileConfig>(key: T, value: IFileConfig[T]) {
    store.set(key, value);
    this.save();
  },
};
