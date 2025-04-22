
import type { Server } from '@dayzserver/sdk';
import { ServerGrid } from '../servers/ServerGrid';

export function DashboardPage({ servers = [] }: {
  servers?: Server[]
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <ServerGrid servers={servers} />
        </div>
      </div>
    </div>
  )
}