import template from "lodash-es/template";
import https from "https";
import {execa} from 'execa'
import { Config } from "./config";


export type SearchResult = string;
export type SearchResultList = SearchResult[];


export const useCachedLogin = async () => {
  const steamUsername = Config.get('steamUsername');
  const args = [
    `+force_install_dir ${Config.get('SERVER_FILES')}`,
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
    `+force_install_dir ${Config.get('SERVER_FILES')}`,
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
  const serverFiles = Config.get('SERVER_FILES');
  const username = Config.get('steamUsername');
  return await baseSteamcmd([
    `+force_install_dir ${serverFiles}`,
    `+login "${username}"`,
    ...args
  ])
}


const searchUrlTemplate = template(Config.get('STEAM_SEARCH_URL_TEMPLATE'), {
  interpolate: /{{([\s\S]+?)}}/g,
});
const createSearchUrl = ({ search_text }: { search_text: string }) =>
  searchUrlTemplate({
    search_text,
    api_key: Config.get('STEAM_APIKEY'),
  });

export const apiSearch = async (search_text: string) => {
  const url = createSearchUrl({
    search_text,
  });

  return new Promise<SearchResultList>((resolve, reject) => {
    https
      .get(url, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", () => {
          const result = JSON.parse(data);
          resolve(result);
        });
      })
      .on("error", (err) => {
        console.log(err.message);
        reject(err);
      });
  });
};
