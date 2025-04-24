import { setResponseStatus } from '@tanstack/react-start/server';
import sdk, { SteamWorkshopSearchResults } from '@dayzserver/sdk';

import { ResponseCodes } from './codes';
import { z } from 'zod';
import { createErrorResponseBody, createResponseBody, errorResponseBodyError } from '../../response';
import { ErrorResponse, SuccessResponse } from '@/types/response';
import { createServerFn, Fetcher } from '@tanstack/react-start';
import { IPublishedFileServiceQueryFilesRequestParamsSchema } from '@dayzserver/sdk/steamSchema';


/**
 * Search for mods
 */
type SearchWorkshopFn = Fetcher<
  undefined,
  typeof IPublishedFileServiceQueryFilesRequestParamsSchema,
  SuccessResponse<SteamWorkshopSearchResults, ResponseCodes.SearchQuerySuccess> | ErrorResponse<string, ResponseCodes.SearchQueryError>,
  "data"
>;

export const searchWorkshop: SearchWorkshopFn = createServerFn()
  .validator(IPublishedFileServiceQueryFilesRequestParamsSchema)
  .handler(async (context) => {
    try {
      const results = await sdk.steam.apiSearch(context.data);
      const body = createResponseBody({
        code: ResponseCodes.SearchQuerySuccess,
        data: results,
      });

      return body;
    } catch {
      const body = createErrorResponseBody<
        string,
        ResponseCodes.SearchQueryError
      >({
        code: ResponseCodes.SearchQueryError,
        data: `Error searching for ${context.data.search_text}`,
      });

      setResponseStatus(500);
      return body;
    }
  });

const LoginParametersSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginFn = Fetcher<
  undefined,
  typeof LoginParametersSchema,
  SuccessResponse<{}, ResponseCodes.LoginSuccess> | ErrorResponse<{}, ResponseCodes.LoginFailed>,
  'data'
>;

export const login: LoginFn = createServerFn({ method: 'POST' })
  .validator(LoginParametersSchema)
  .handler(async (context) => {
    try {
      await sdk.steam.login(context.data);
      return createResponseBody({
        code: ResponseCodes.LoginSuccess
      })
    } catch (error) {
      const body = createErrorResponseBody({
        code: ResponseCodes.LoginFailed,
        error: errorResponseBodyError(error)
      })

      return body
    }
  });
