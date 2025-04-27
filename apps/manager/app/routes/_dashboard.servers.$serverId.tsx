import { createFileRoute } from '@tanstack/react-router';

import { server } from '../core/api';

import { ErrorScreen } from '@/components/error-screen';
import { ServerDetailPage } from '@/components/features/servers/ServerDetailPage';
import { isErrorResponse } from '@/types/response';

export const Route = createFileRoute('/_dashboard/servers/$serverId')({
  component: RouteComponent,
  staticData: {
    breadcrumb: 'Server',
  },
  loader: async ({ params }) => server.getServerDetail({ data: params }),
});

function RouteComponent() {
  const state = Route.useLoaderData();

  if (isErrorResponse(state)) {
    return <ErrorScreen />;
  }

  return <ServerDetailPage server={state?.data.server} />;
}
