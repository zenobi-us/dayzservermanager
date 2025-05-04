import { createFileRoute } from '@tanstack/react-router';

import { ErrorScreen } from ':components/error-screen';
import { isErrorResponse } from ':types/response';

import { DashboardPage } from '../../components/features/dashboard/DashboardPage';
import { server, mods } from '../../core/api';

export const Route = createFileRoute('/_app/d/')({
  component: RouteComponent,
  loader: async () => {
    const [serversData, modsData] = await Promise.all([
      server.getAllServers(),
      mods.getModList(),
    ]);

    return {
      ...serversData.data,
      ...modsData.data,
    };
  },
});

function RouteComponent() {
  const state = Route.useLoaderData();

  if (isErrorResponse(state)) {
    return <ErrorScreen />;
  }

  return <DashboardPage servers={state.servers} mods={state.mods} />;
}
