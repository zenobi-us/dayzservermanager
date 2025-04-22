import DashboardPage from '@/components/features/dashboard/Page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/demo/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DashboardPage/>
}
