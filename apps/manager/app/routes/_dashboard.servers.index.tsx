import { createFileRoute } from '@tanstack/react-router'
import { server } from '../api'
import { ServersDashboardPage } from '@/components/features/servers/ServerListPage'
import { isErrorResponse } from '@/types/response'
import { ErrorScreen } from '@/components/error-screen'

export const Route = createFileRoute('/_dashboard/servers/')({
  component: RouteComponent,
  staticData: {
    breadcrumb: 'Servers'
  },
  loader: async () => server.getAllServers()
})

function RouteComponent() {
  const state = Route.useLoaderData()
  
  if (isErrorResponse(state)) {
    return <ErrorScreen />
  }

  return <ServersDashboardPage servers={state?.data.servers || []} />
}
