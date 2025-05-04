import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import { isErrorResponse } from ':types/response';

import * as api from '../../../core/api';

export function useGetServerModsQuery({ serverId }: { serverId?: string }) {
  const getModsListServerFn = useServerFn(api.mods.getServerModList);
  return useQuery({
    enabled: !!serverId,
    queryFn: () => {
      if (!serverId) {
        return null;
      }

      return getModsListServerFn({ data: { serverId } });
    },
    queryKey: useGetServerModsQuery.createKey({ serverId }),
    select: (data) => {
      if (isErrorResponse(data)) {
        return [];
      }
      return data?.data.mods || [];
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

useGetServerModsQuery.createKey = function ({
  serverId,
}: {
  serverId?: string;
}) {
  return ['server-mods', serverId];
};
