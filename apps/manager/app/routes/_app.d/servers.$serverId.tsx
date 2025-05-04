import { createFileRoute } from '@tanstack/react-router';

import { ServerDetailPageContainer } from ':components/features/servers/ServerDetailPage';

export const Route = createFileRoute('/_app/d/servers/$serverId')({
  component: RouteComponent,
  staticData: {
    breadcrumb: 'Server',
  },
});

function RouteComponent() {
  const params = Route.useParams();
  return <ServerDetailPageContainer serverId={params.serverId} />;
}
