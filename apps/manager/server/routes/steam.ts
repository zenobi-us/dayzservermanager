import { Router } from "express";
import { createErrorResponseBody, createResponseBody } from "../core/response";
import * as steam from "../core/steam";

const router = Router();
export default router;

enum ResponseCodes {
  SearchQuerySuccess = "SearchQuerySuccess",
  SearchQueryError = "SearchQueryError",
}

/**
 * Create a list of mods
 */
router.get<{
  searchString: string;
}>("/:searchString", async (req, res) => {
  const searchString = req.params["searchString"];
  try {
    const results = await steam.apiSearch(searchString);
    const body = createResponseBody({
      code: ResponseCodes.SearchQuerySuccess,
      data: results,
    });
    res.send(body);

  } catch (err) {
    const body = createErrorResponseBody({
      code: ResponseCodes.SearchQueryError,
      data: `Error searching for ${searchString}`,
    });
    res.status(500).send(body);
    return;
  }
});

