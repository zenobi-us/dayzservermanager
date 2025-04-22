import fsExists from "fs.promises.exists";
import { Config } from './config'

export type AppStatus = {
  appid: string;
  installed: boolean;
  version: string;
}


type Pkg =  { name:string, version:string}
export const getFormattedVersion = (pkg?:Pkg) => {
  if (!pkg) {
    return "unknown"
  }
  return `${pkg?.name}@${pkg?.version}`;
};


export const getMetaStatus = async (pkg?: Pkg) => {
  const cmd = Config.get('SERVER_COMMAND');
  const installed = await fsExists(cmd);
  const appid = Config.get('SERVER_APPID')
  const version = installed? getFormattedVersion(pkg) : ''
  const status:AppStatus = {
    appid,
    installed,
    version,
  }

  return status
}