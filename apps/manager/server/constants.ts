import path from "path";
import pkg from "../package.json" assert { type: "json" };

/*
 Without a release binary, we must use the experimental server app ID.
 */
const server_appid = "1042420";

/*
  DayZ release client Steam app ID. This is for mods, as only the release client has them.
  */
const client_appid = "221100";

/*
  Denote if it's release or experimental
  */
const versions = {
  "1042420": "Experimental",
  "223350": "Release",
};
const appid_version = versions[server_appid];

/*
  Base file locations
  */
const modDir = "/mods";
const serverFiles = "/serverfiles";


/*
   XML config files the system can handle. These are retrieved from values in templates located in /files/mods/:modId
   */
const configFiles = [
  "cfgeventspawns.xml",
  "cfgspawnabletypes.xml",
  "events.xml",
  "types.xml",
];

// From https://helpthedeadreturn.wordpress.com/2019/07/17/dayz-sa-mission-file
const allConfigFiles = {
  db: [
    // global server config and core loot economy files
    "events.xml", // dynamic events
    "globals.xml", // global settings
    "messages.xml", // server broadcast messages and shutdown
    "types.xml", // loot table
  ],
  env: [
    // coordinates, static and dynamic spawns for each entity
    "cattle_territories.xml",
    "domestic_animals_territories.xml",
    "hare_territories.xml",
    "hen_territories.xml",
    "pig_territories.xml",
    "red_deer_territories.xml",
    "roe_deer_territories.xml",
    "sheep_goat_territories.xml",
    "wild_boar_territories.xml",
    "wolf_territories.xml",
    "zombie_territories.xml",
  ],
  root: [
    "cfgeconomycore.xml", // loot economy core settings and extensions
    "cfgeffectarea.json", // static contaminated area coordinates and other properties
    "cfgenvironment.xml", // includes env\* files and parameters
    "cfgeventgroups.xml", // definitions of groups of objects that spawn together in a dynamic event
    "cfgeventspawns.xml", // coordinates where events may occur
    "cfggameplay.json", // gameplay configuration settings.
    "cfgIgnoreList.xml", //  list of items that won’t be loaded from the storage
    "cfglimitsdefinition.xml", // list of valid categories, tags, usageflags and valueflags
    "cfglimitsdefinitionuser.xml", // shortcut groups of usageflags and valueflags
    "cfgplayerspawnpoints.xml", // new character spawn points
    "cfgrandompresets.xml", // collection of groups of items
    "cfgspawnabletypes.xml", // loot categorization (ie hoarder) as well as set of items that spawn as cargo or as attachment on weapons, vehicles or infected.
    "cfgundergroundtriggers.json", // used for triggering light and sounds in the Livonia bunker, not used for Chernarus
    "cfgweather.xml", // weather configuration
    "init.c", // mission startup file (PC only)
    "map*.xml",
    "mapgroupproto.xml", // structures, tags, maxloot and lootpoints
    "mapgrouppos.xml", // all valid lootpoints
  ],
};


// TODO, add zod
type Config = {
  installFile: string;
  modDir: string;
  port: number;
  steamAPIKey?: string;
  steamSearchUrlTemplate: string;
  steamLogin?: string;
};

const config:Config = {
  installFile: path.join(serverFiles + "DayZServer"),
  modDir: path.join(modDir + client_appid),
  port: 8000,
  steamSearchUrlTemplate:  "https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/?numperpage=1000&appid=221100&return_short_description=true&strip_description_bbcode=true&key={{api_key}}&search_text={{search_text}}",
  steamAPIKey: process.env["STEAMAPIKEY"],
  steamLogin: undefined
};

export {
  allConfigFiles,
  appid_version,
  client_appid,
  config,
  configFiles,
  modDir,
  pkg,
  server_appid,
  serverFiles,
  versions,
};
