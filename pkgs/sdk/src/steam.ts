import template from "lodash-es/template";
import https from "https";
import { execa } from 'execa'
import { Config } from "./config";

import { EPublishedFileQueryType, IPublishedFileServiceQueryFilesRequestParams, SteamWorkshopSearchResults, SteamWorkshopSearchResultsSchema } from './steamSchema'

export const useCachedLogin = async () => {
  const steamUsername = Config.get('steamUsername');
  const args = [
    `+force_install_dir ${Config.get('STEAMSTORE')}`,
    steamUsername ? `+login '${steamUsername}'` : "",
    "+quit",
  ];
  await baseSteamcmd(args);
};

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const args = [
    `+force_install_dir ${Config.get('STEAMSTORE')}`,
    `+login '${username}'`,
    "+quit",
  ];

  await baseSteamcmd(args, { input: password });

  Config.set('steamUsername', username);
};

export const baseSteamcmd = async (args: string[], options: Parameters<typeof execa>[1] = {}) => {
  return await execa(options)`steamcmd ${args.join(" ")}`
};

export const authenticatedSteamCmd = async (args: string[]) => {
  const serverFiles = Config.get('STEAMSTORE');
  const username = Config.get('steamUsername');
  return await baseSteamcmd([
    `+force_install_dir ${serverFiles}`,
    `+login "${username}"`,
    ...args
  ])
}

const createSearchUrl = ({ search_text, page = 1, numperpage = 10, ...options }: IPublishedFileServiceQueryFilesRequestParams) => {
  const appid = Config.get('CLIENT_APPID')
  const key = Config.get('STEAM_APIKEY')

  if (!key) {
    throw new Error
  }

  const url = new URL("https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/");
  const cleaned = Object.fromEntries(Object.entries(options).filter(([_, v]) => v !== undefined).map((key, value) => [key, value.toString()]));
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
}

/**
 * https://partner.steamgames.com/doc/webapi/IPublishedFileService#QueryFiles
 */
export const apiSearch = async (params: IPublishedFileServiceQueryFilesRequestParams) => {
  const url = createSearchUrl(params);

  return new Promise<SteamWorkshopSearchResults>((resolve, reject) => {
    https
      .get(url, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", async () => {
          try {
            const result = JSON.parse(data);
            const parsed = await SteamWorkshopSearchResultsSchema.safeParseAsync(result)
            if (parsed.success) {
              resolve(parsed.data);
            } else {
              console.error("Failed to parse steam search results", parsed.error);
              reject(new Error("Failed to parse steam search results"));
            }
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", (err) => {
        console.log(err.message);
        reject(err);
      });
  });
};
