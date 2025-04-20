import { Router } from "express";
import { createErrorResponseBody, createResponseBody } from "../core/response";
import * as mods from "../core/mods";
import * as fs from "../core/fs";
import { config } from "../constants";
import fsExists from "fs.promises.exists";

const router = Router();
export default router;

enum ResponseCodes {
  ModInstallSuccess = "ModInstallSuccess",
  ModInstallError = "ModInstallError",
  ModFileNotFound = "ModFileNotFound",
  ModFileFound = "ModFileFound",
  ModListSuccess = "ModListSuccess",
  ModNotFoundError = "ModNotFoundError",
  ModParsingError = "ModParsingError",
  ModFoundSuccess = "ModFoundSuccess",
  ModListError = "ModListError",
  ModRemovedSuccess = "ModRemovedSuccess",
  ModUpdateSuccess = "ModUpdateSuccess",
  ModActivatedSuccess = "ModActivatedSuccess",
  ModDeactivatedSuccess = "ModDeactivatedSuccess",
  ModFileContentsError = "ModFileContentsError",
}

/**
 * Create a list of mods
 */
router.get("/", async (req, res) => {
  const output = await mods.getMods();
  res.send(
    createResponseBody({
      code: ResponseCodes.ModListSuccess,
      data: { mods: output },
    })
  );
});
//  /*
//   Get all mod metadata
//   */
//   app.get('/mods', (req, res) => {
//     const mods = getMods()
//     const ret = {
//         "mods": mods
//     }
//     res.send(ret)
// })


/**
 * Get mod metadata
 */
router.get<{
  modId: string;
}>("/:mod_id", async (req, res) => {
  const modId = req.params["modId"];
  const modDir = mods.createModDirPath(modId);
  const modDirExists = await fsExists(modDir);

  if (!modDirExists) {
    const body = createErrorResponseBody({
      code: ResponseCodes.ModNotFoundError,
      data: null,
    });
    res.status(404).send(body);
    return;
  }

  try {
    const customXML = mods.getCustomXML(modId);
    const output = {
      id: modId,
      name: mods.getModNameById(modId),
      size: fs.getDirSize(modDir),
      customXML: customXML,
    };

    const body = createResponseBody({
      data: output,
      code: ResponseCodes.ModFoundSuccess,
    });

    res.send(body);
  } catch (error) {
    const body = createErrorResponseBody({
      code: ResponseCodes.ModParsingError,
      data: `Error parsing mod ${modId}`,
    });
    res.status(500).send(body);
  }
});

/**
 * Get mod file data
 */
router.get<{
  modId: string;
  file: string;
}>("/:mod_id/:file", async (req, res) => {
  const modId = req.params["modId"];
  const file = req.params["file"];
  try {
    const contents = mods.getModFileContents(modId, file);

    if (!contents) {
      const body = createErrorResponseBody({
        code: ResponseCodes.ModFileNotFound,
      });
      res.status(404).send(body);
      return;
    }
    res.set("content-type", "application/xml");
    res.send(contents);
  } catch (error) {
    const body = createErrorResponseBody({
      code: ResponseCodes.ModFileContentsError,
      data: "An error occurred while fetching the mod file",
    });
    res.status(500).send(body);
  }
});

/**
 * Install a mod from steam
 */
router.get<{ modId: string }>("/install/:modId", (req, res) => {
  const modId = req.params["modId"];
  const body = createResponseBody({
    data: `Mod ${modId} installed successfully`,
    code: ResponseCodes.ModInstallSuccess,
  });
  res.send(body);
});

/**
 * Remove a mod from the server
 */
router.get<{ modId: string }>("/remove/:mod_id", (req, res) => {
  const modId = req.params["modId"];
  const body = createResponseBody({
    code: ResponseCodes.ModRemovedSuccess,
    data: `Mod ${modId} removed successfully`,
  });
  res.send(body);
});

/**
 * Update a mod on the server
 */
router.get<{ modId: string }>("/update/:mod_id", (req, res) => {
  const modId = req.params["modId"];
  const body = createResponseBody({
    code: ResponseCodes.ModUpdateSuccess,
    data: `Mod ${modId} updated successfully`,
  });
  res.send(body);
});

/**
 * Activate a mod on the server
 */
router.get<{ modId: string }>("/activate/:mod_id", (req, res) => {
  const modId = req.params["modId"];
  const body = createResponseBody({
    code: ResponseCodes.ModActivatedSuccess,
    data: `Mod ${modId} activated successfully`,
  });
  res.send(body);
});

/**
 * Deactivate a mod on the server
 */
router.get<{ modId: string }>("/deactivate/:mod_id", (req, res) => {
  const modId = req.params["modId"];
  const body = createResponseBody({
    code: ResponseCodes.ModDeactivatedSuccess,
    data: `Mod ${modId} deactivated successfully`,
  });
  res.send(body);
});

