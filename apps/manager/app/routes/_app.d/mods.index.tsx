import { createFileRoute } from '@tanstack/react-router';

import { ErrorScreen } from ':components/error-screen';
import { FullScreenLoader } from ':components/full-screen-loader';
import { isErrorResponse } from ':types/response';

import { ModListDashboardPage } from '../../components/features/mods/ModListDashboardPage';
import { mods } from '../../core/api';

export const Route = createFileRoute('/_app/d/mods/')({
  component: RouteComponent,
  staticData: {
    breadcrumb: 'Mods',
  },
  loader: async () => mods.getModList(),
  pendingComponent: FullScreenLoader,
});

function RouteComponent() {
  const state = Route.useLoaderData();

  if (isErrorResponse(state)) {
    return <ErrorScreen />;
  }

  return <ModListDashboardPage data={state.data?.mods} />;
}
