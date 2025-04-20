import { config, configFiles, serverFiles } from "../constants";
import fs from "fs/promises";
import fsExists from "fs.promises.exists";
import { join } from "path";

type CustomXmlItem = { name: string };

export const getCustomXML = async (modId: string) => {
  const output: CustomXmlItem[] = [];
  const exists = await fsExists(config.modDir);

  if (!exists) {
    return output;
  }

  const configFilePaths = configFiles.map(async (file) => {
    if (!fsExists(createModFilePath(modId, file))) {
      return;
    }
    output.push({ name: file });
  });

  await Promise.all(configFilePaths);

  return output;
};

export const getModNameById = async (id: string) => {
  const files = await fs.readdir(serverFiles, {
    encoding: "utf8",
    withFileTypes: true,
  });

  for (const file of files) {
    if (!file.isSymbolicLink()) {
      continue;
    }
    const filepath = join(serverFiles, file.name);

    if (!fsExists(filepath)) {
      continue;
    }

    const sym = await fs.readlink(filepath);

    if (sym.indexOf(id) < 0) {
      continue;
    }

    return file.name;
  }

  return "";
};

type ModeItem = { name: string; id: string };
export const getMods = async () => {
  const mods: ModeItem[] = [];
  const modDirExists = await fsExists(config.modDir);

  if (!modDirExists) {
    return mods;
  }

  const modFiles = await fs.readdir(config.modDir);
  
  for (const file of modFiles) {
    const name = await getModNameById(file);
    mods.push({ name: name, id: file });
  }

  return mods;
};


export async function getModFileContents(modId: string, file: string) {
  const modFilePath = createModFilePath(modId, file);
  const modFileExists = await fsExists(modFilePath);

  if (!modFileExists) {
    return null;
  }

  const contents = await fs.readFile(modFilePath, { encoding: "utf8" });
  return contents;
}

export function createModDirPath(modId: string) {
  return join(config.modDir, modId);
}
export function createModFilePath(modId: string, filepath:string) {
  return join(config.modDir, modId, filepath);
}