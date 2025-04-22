
import { PageHeader } from '@/components/page-header';
import { SectionCards } from '@/components/section-cards';
import type { Server } from '@dayzserver/sdk';
import { IconPackages } from '@tabler/icons-react';
import { useMemo } from 'react';

export function ServerDetailPage({ server }: {
  server: Server
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <ServerDetailHeader server={server} />
          <SectionCards>
            <ServerMapCard server={server} />
            <ServerModCard server={server} />
          </SectionCards>
        </div>
      </div>
    </div>
  )
}

function ServerDetailHeader({ server }: { server: Server }) {
  return (
    <PageHeader title={server.id} />
  )
}

function ServerMapCard({ server }: { server: Server }) {
  return (
    <SectionCards.Item
      title="map"
      description={server.map}
    />
  )
}

function ServerModCard({ server }: { server: Server }) {
  
  const mods = useMemo(() => server.mods || [], [server])

  return (
    <SectionCards.Item
      title="mods"
      description={`${mods.length} activated mods`}
      footer={
        <>
          {mods.length > 0 && (
            <SectionCards.TextPrimary icon={IconPackages}>
              {mods.length} installed mods
            </SectionCards.TextPrimary>
          )}
        </>
      }
    />
  )
}