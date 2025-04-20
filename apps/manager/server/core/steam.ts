import { spawn } from "child_process";
import { config, serverFiles } from "../constants";
import template from "lodash-es/template";
import https from 'https'

export const login = () => {
  const args = [
    `+force_install_dir ${serverFiles}`,
    config.steamLogin ? `+login '${config.steamLogin}'` : "",
    "+quit",
  ];
  steamcmd(args.join(" "));
};

export const steamcmd = async (args: string) => {
  return await spawn("steamcmd " + args);
};

const searchUrlTemplate = template(config.steamSearchUrlTemplate, {
  interpolate: /{{([\s\S]+?)}}/g,
});
const createSearchUrl = ({ search_text }: { search_text: string }) =>
  searchUrlTemplate({
    search_text,
    api_key: config.steamAPIKey,
  });

export const apiSearch = async (search_text: string) => {
  const url = createSearchUrl({
    search_text,
  });
  
  return new Promise<string[]>((resolve, reject) => {
    https
      .get(url, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", () => {
          const result = JSON.parse(data)
          resolve(result);
        });
      })
      .on("error", (err) => {
        console.log(err.message);
        reject(err)
      });
  })

};
