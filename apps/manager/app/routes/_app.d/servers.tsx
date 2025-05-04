import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/d/servers')({
  component: RouteComponent,
  staticData: {
    breadcrumb: 'Servers',
  },
});

function RouteComponent() {
  return <Outlet />;
}
