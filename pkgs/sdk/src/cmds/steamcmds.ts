import { execa } from 'execa';

import { Config } from './config';

export const baseSteamcmd = async (
  args: string[],
  options: Parameters<typeof execa>[1] = {},
) => {
  try {
    const cmd = execa(options);
    return await cmd(`steamcmd`, args);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const authenticatedSteamCmd = async (args: string[]) => {
  const serverFiles = Config.get('STEAMSTORE');
  const username = Config.get('steamUsername');
  return await baseSteamcmd([
    `+force_install_dir ${serverFiles}`,
    `+login "${username}"`,
    ...args,
  ]);
};
