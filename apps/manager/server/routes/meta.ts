import { Router } from "express";
import { createResponseBody } from "../core/response";
import * as meta from "../core/meta";

const router = Router();
export default router

enum ResponseCodes {
  ServerBaseFilesUpdateSuccess = "ServerBaseFilesUpdateSuccess",
  ServerBaseFilesUpdateError = "ServerBaseFilesUpdateError",
}
/**
 * Get the status of things:
 * - If the base files are installed, 
 * - the version of the server,
 * - the appid (If release or experimental)
 */
router.get("/status", async (req, res) => {
  const status = await meta.getMetaStatus();
  const body = createResponseBody({
    code: ResponseCodes.ServerBaseFilesUpdateSuccess,
  });
  res.send(body);
});

