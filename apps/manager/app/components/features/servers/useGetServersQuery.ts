import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { server } from '../../../core/api';

export const getServersQueryOptions = queryOptions({
  queryKey: ['servers'],
  queryFn: () => server.getAllServers(),
});

export function useSuspenseGetServersQuery() {
  return useSuspenseQuery(getServersQueryOptions);
}
