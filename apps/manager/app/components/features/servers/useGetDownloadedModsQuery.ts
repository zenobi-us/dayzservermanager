import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import * as api from '../../../core/api';

import { isErrorResponse } from '@/types/response';

export function useGetDownloadedModsQuery() {
  const getModsListServerFn = useServerFn(api.mods.getModList);
  return useQuery({
    queryFn: () => getModsListServerFn(),
    queryKey: ['get-downloaded-mods'],
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
