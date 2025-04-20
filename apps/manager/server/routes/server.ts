import { Router } from "express";
import { createResponseBody } from "../core/response";
import * as steam from "../core/steam";

const router = Router();
export default router

enum ResponseCodes {
  ServerBaseFilesUpdateSuccess = "ServerBaseFilesUpdateSuccess",
  ServerBaseFilesUpdateError = "ServerBaseFilesUpdateError",
}
/**
 * Create a list of mods
 */
router.get<{
  searchString: string;
}>("/updatebase", async (req, res) => {
  steam.login();
  const body = createResponseBody({
    code: ResponseCodes.ServerBaseFilesUpdateSuccess,
  });
  res.send(body);
});
