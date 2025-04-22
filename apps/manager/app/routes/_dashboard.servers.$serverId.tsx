import { createFileRoute } from '@tanstack/react-router'
import { server } from '../api'
import { isErrorResponse } from '@/types/response'
import { ErrorScreen } from '@/components/error-screen'
import { ServerDetailPage } from '@/components/features/servers/ServerDetailPage'

export const Route = createFileRoute('/_dashboard/servers/$serverId')({
  component: RouteComponent,
  staticData: {
    breadcrumb: 'Server'
  },
  loader: async ({ params }) => server.getServerDetail({ data: params })
})

function RouteComponent() {
  const state = Route.useLoaderData()
  
  if (isErrorResponse(state)) {
    return <ErrorScreen />
  }

  return <ServerDetailPage server={state?.data.server} />
}
