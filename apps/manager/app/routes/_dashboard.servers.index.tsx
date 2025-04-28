import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { ErrorScreen } from '@/components/error-screen';
import { ServersDashboardPage } from '@/components/features/servers/ServerListPage';
import { getServersQueryOptions } from '@/components/features/servers/useGetServersQuery';
import { isErrorResponse } from '@/types/response';

export const Route = createFileRoute('/_dashboard/servers/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(getServersQueryOptions);
  },
});

function RouteComponent() {
  // Read the data from the cache and subscribe to updates
  const { data } = useSuspenseQuery(getServersQueryOptions);

  if (isErrorResponse(data)) {
    return <ErrorScreen />;
  }

  return <ServersDashboardPage servers={data?.data.servers || []} />;
}
