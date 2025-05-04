import { useQuery } from '@tanstack/react-query';

import { getServerDetail } from ':core/api/server/routes';
import { isErrorResponse } from ':types/response';

export const useGetServerDetailQuery = ({ serverId }: { serverId: string }) => {
  const query = useQuery({
    queryFn: () => getServerDetail({ data: { serverId } }),
    queryKey: useGetServerDetailQuery.createKey({ serverId }),
    select(data) {
      if (!data || isErrorResponse(data)) {
        return null;
      }

      return data.data.server;
    },
  });

  return query;
};
useGetServerDetailQuery.createKey = ({ serverId }: { serverId?: string }) => [
  'server-detail',
  serverId,
];
