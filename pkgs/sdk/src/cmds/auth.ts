import { Config } from './config';
import * as steamcmds from './steamcmds';

export const useCachedLogin = async () => {
  const steamUsername = Config.get('steamUsername');
  const args = [
    `+force_install_dir ${Config.get('STEAMSTORE')}`,
    steamUsername ? `+login '${steamUsername}'` : '',
    '+quit',
  ];
  await steamcmds.baseSteamcmd(args);
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
    `+login "${username}" "${password}"`,
    '+quit',
  ];

  const result = await steamcmds.baseSteamcmd(args);
  console.dir(result);

  Config.set('steamUsername', username);
  Config.save();

  return username;
};
