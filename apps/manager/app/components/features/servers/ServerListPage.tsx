import { Page } from '@/components/page';

import { ServerGrid } from './ServerGrid';

import type { Server } from '@dayzserver/sdk/schema';

export function ServersDashboardPage({ servers = [] }: { servers: Server[] }) {
  return (
    <Page>
      <ServerGrid servers={servers} />
    </Page>
  );
}
