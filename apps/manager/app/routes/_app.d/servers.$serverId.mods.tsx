import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/d/servers/$serverId/mods')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_dashboard/servers/$serverId/mods"!</div>;
}
