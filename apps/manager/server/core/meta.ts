import fsExists from "fs.promises.exists";
import { appid_version, config, pkg } from "../constants";

export const getFormattedVersion = (installed?: boolean) => {
  if (!installed) {
    return "";
  }

  return `${pkg.name}@${pkg.version}`;
};


export const getMetaStatus = async () => {
  const installed = await fsExists(config.installFile);
  const version = getFormattedVersion(installed);
  const status = {
    appid: appid_version,
    installed,
    version,
  }

  return status
}