import { mods } from '../core/api';
import { ErrorScreen } from '@/components/error-screen';
import { ModListDashboardPage } from '@/components/features/mods/ModListPage';
import { FullScreenLoader } from '@/components/full-screen-loader';
import { isErrorResponse } from '@/types/response';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/mods')({
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

  return <ModListDashboardPage mods={state.data?.mods} />;
}
