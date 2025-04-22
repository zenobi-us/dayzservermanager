import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import sdk from "@dayzserver/sdk";

import { ResponseCodes } from "./codes";
import { z } from "zod";
import {
  createErrorResponseBody,
  createResponseBody,
} from "../../core/response";

/**
 * Create a list of mods
 */
const SearchSteamWorkhopParameterSchema = z.object({
  searchString: z.string(),
});

const searchWorkshop = createServerFn({ method: "GET" })
  .validator((data: string) => SearchSteamWorkhopParameterSchema.parse(data))
  .handler(async (context) => {
    const searchString = context.data.searchString;

    try {
      const results = await sdk.steam.apiSearch(searchString);
      const body = createResponseBody({
        code: ResponseCodes.SearchQuerySuccess,
        data: results,
      });

      return body;
    } catch (err) {
      const body = createErrorResponseBody<
        string,
        ResponseCodes.SearchQueryError
      >({
        code: ResponseCodes.SearchQueryError,
        data: `Error searching for ${searchString}`,
      });

      setResponseStatus(500);
      return body;
    }
  });

const LoginParametersSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const login = createServerFn({ method: "POST" })
  .validator((data: unknown) => LoginParametersSchema.parse(data))
  .handler(async (context) => {
    try {
      sdk.steam.login(context.data);
    } catch (error) {
      const body = createResponseBody({
        code: ResponseCodes.LoginFailed,
      });

      setResponseStatus(401);

      return body;
    }

    const body = createResponseBody({
      code: ResponseCodes.LoginSuccess,
    });

    return body;
  });
export { searchWorkshop, login };
