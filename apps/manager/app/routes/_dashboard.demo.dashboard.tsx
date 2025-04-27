import { createFileRoute } from '@tanstack/react-router';

import { DashboardPage } from '../components/features/dashboard/DashboardPage';

export const Route = createFileRoute('/_dashboard/demo/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return <DashboardPage />;
}
