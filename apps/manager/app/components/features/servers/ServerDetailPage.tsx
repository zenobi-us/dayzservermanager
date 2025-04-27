import { IconPackages, IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useMemo } from 'react';

import * as api from '../../../core/api';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { PageHeader } from '@/components/page-header';
import { SectionCards } from '@/components/section-cards';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { isErrorResponse } from '@/types/response';

import type { Server } from '@dayzserver/sdk/schema';
import type { PropsWithChildren } from 'react';

export function ServerDetailPage({ server }: { server: Server }) {
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
  );
}

function ServerDetailHeader({ server }: { server: Server }) {
  return (
    <PageHeader
      title={server.id}
      actions={
        <>
          <AddServerModDrawer>
            <Button variant="outline">
              <IconPlus className="mr-2" /> Add mod
            </Button>
          </AddServerModDrawer>
        </>
      }
    />
  );
}

function ServerMapCard({ server }: { server: Server }) {
  if (server.error) {
    return null;
  }
  return <SectionCards.Item title="map" description={server.map} />;
}

function ServerModCard({ server }: { server: Server }) {
  const mods = useMemo(() => (!server.error && server.mods) || [], [server]);

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
  );
}

function useGetDownloadedModsQuery() {
  const getModsListServerFn = useServerFn(api.mods.getModList);
  return useQuery({
    queryFn: () => getModsListServerFn(),
    queryKey: ['get-downloaded-mods'],
    select: (data) => {
      if (isErrorResponse(data)) {
        return [];
      }
      return data.data.mods || [];
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

function AddServerModDrawer({ children }: PropsWithChildren) {
  const downloadedModsQuery = useGetDownloadedModsQuery();
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="flex flex-col mx-4 min-h-3/4 max-h-3/4">
        {downloadedModsQuery.isPending && <FullScreenLoader />}
        {!downloadedModsQuery.isPending && (
          <pre>{JSON.stringify(downloadedModsQuery.data, null, 2)}</pre>
        )}
      </DrawerContent>
    </Drawer>
  );
}
