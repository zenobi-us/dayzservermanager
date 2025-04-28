import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useCallback, useState } from 'react';

import * as api from '../../../core/api';

import { isErrorResponse } from '@/types/response';

import type { ResponseCodes } from '@/core/api/mods/codes';
import type { SteamWorkshopSearchResults } from '@dayzserver/sdk/schema';

const computePageCount = ({
  numperpage,
  totalResults,
}: {
  numperpage: number;
  totalResults?: SteamWorkshopSearchResults['response']['total'];
}) => {
  if (!totalResults) {
    return 0;
  }

  if (totalResults < numperpage) {
    return 1;
  }

  return Math.ceil(totalResults / numperpage);
};

export const useModSearchMutation = () => {
  const mutationFn = useServerFn(api.mods.searchWorkshop);
  const [store, setStore] = useState({
    search_text: '',
    page: 1,
    numperpage: 10,
    pageCount: 0,
    results:
      [] as SteamWorkshopSearchResults['response']['publishedfiledetails'],
    total: 0,
    error: '',
  });

  const mutation = useMutation({
    mutationFn,
    onError(data) {
      if (!('result' in data)) {
        return;
      }

      if (!isErrorResponse<{}, ResponseCodes.SearchQueryError>(data.result)) {
        return;
      }

      const errorCode = data.result.errorCode;
      const error = data.result.error;

      setStore((state) => ({
        ...state,
        error: `${errorCode}: ${error?.toString()}`,
      }));
    },
    onSuccess(data) {
      // if (!('result' in data)) {
      //   return;
      // }
      if (isErrorResponse(data)) {
        return;
      }

      setStore((state) => {
        return {
          ...state,
          total: data.data.response.total,
          results: data.data.response.publishedfiledetails,
          pageCount: computePageCount({
            numperpage: store.numperpage,
            totalResults: data.data.response.total,
          }),
        };
      });
    },
  });

  const search = useCallback(
    (query: Partial<Parameters<typeof mutation.mutate>[0]['data']>) => {
      mutation.mutate({
        data: {
          search_text: store.search_text,
          page: store.page,
          numperpage: store.numperpage,
          ...query,
        },
      });
      setStore((state) => ({
        ...state,
        search_text: query.search_text || store.search_text,
        page: query.page || store.page,
        numperpage: query.numperpage || store.numperpage,
      }));
    },
    [mutation, store.search_text, store.page, store.numperpage],
  );

  const reset = () => {
    setStore((state) => ({
      ...state,
      search_text: '',
      numperpage: 10,
      page: 1,
      results: [],
      total: 0,
      pageCount: 0,
    }));
  };

  return {
    ...mutation,
    ...store,
    search,
    reset,
  };
};
