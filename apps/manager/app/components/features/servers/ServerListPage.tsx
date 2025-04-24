
import type { Server } from '@dayzserver/sdk';
import { ServerGrid } from './ServerGrid';
import { Page } from '@/components/page';

export function ServersDashboardPage({ servers = [] }: {
    servers: Server[]
}) {
    return (
        <Page>
            <ServerGrid servers={servers} />
        </Page>
    )
}