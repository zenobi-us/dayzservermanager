import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/servers')({
  component: RouteComponent,
  staticData: {
    breadcrumb: 'Servers',
  },
});

function RouteComponent() {
  return <Outlet />;
}
