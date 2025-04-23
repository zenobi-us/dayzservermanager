import { server } from '../core/api';
import { ErrorScreen } from '@/components/error-screen';
import { DashboardPage } from '../components/features/dashboard/DashboardPage';
import { isErrorResponse } from '@/types/response';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/')({
  component: RouteComponent,
  loader: async () => {
    const servers = await server.getAllServers();

    return {
      ...servers,
    };
  },
});

function RouteComponent() {
  const state = Route.useLoaderData();

  if (isErrorResponse(state)) {
    return <ErrorScreen />;
  }

  return <DashboardPage servers={state.data?.servers} />;
}
