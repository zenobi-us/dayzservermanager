import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import * as api from '../../../core/api';

import { isErrorResponse } from ':types/response';

export function useGetServerModsQuery({ serverId }: { serverId: string }) {
  const getModsListServerFn = useServerFn(api.mods.getServerModList);
  return useQuery({
    queryFn: () => getModsListServerFn({ data: { serverId } }),
    queryKey: useGetServerModsQuery.createKey({ serverId }),
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

useGetServerModsQuery.createKey = function ({
  serverId,
}: {
  serverId: string;
}) {
  return ['get-installed-mods', serverId];
};
