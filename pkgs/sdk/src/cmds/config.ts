import fs from 'fs/promises';

import dotenv from 'dotenv';
import nconf from 'nconf';

import { ConfigSchema } from '../schema/configSchema';

import type { IConfig, IFileConfig } from '../schema/configSchema';

dotenv.config();

const store = nconf.env().file({ file: '.dayzserver.config.json' });

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
      const data = await fs.readFile('.dayzserver.config.json');
      console.dir(JSON.parse(data.toString()));
    });
  },
  set<T extends keyof IFileConfig>(key: T, value: IFileConfig[T]) {
    store.set(key, value);
    this.save();
  },
};
