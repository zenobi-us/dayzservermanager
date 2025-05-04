import { createFileRoute, Outlet } from '@tanstack/react-router';

import { AppLayout } from ':components/app/AppLayout';

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppLayout>
      <AppLayout.Main>
        <Outlet />
      </AppLayout.Main>
    </AppLayout>
  );
}
