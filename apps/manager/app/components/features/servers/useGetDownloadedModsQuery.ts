import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import { isErrorResponse } from ':types/response';

import * as api from '../../../core/api';

export function useGetDownloadedModsQuery() {
  const getModsListServerFn = useServerFn(api.mods.getModList);
  return useQuery({
    queryFn: () => getModsListServerFn(),
    queryKey: useGetDownloadedModsQuery.createKey(),
    select: (data) => {
      if (isErrorResponse(data)) {
        return [];
      }
      return data.data.mods || [];
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
useGetDownloadedModsQuery.createKey = () => ['downloaded-mods'];
