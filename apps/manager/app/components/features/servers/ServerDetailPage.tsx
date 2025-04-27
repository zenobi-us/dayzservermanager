import {
  IconDownload,
  IconDownloadOff,
  IconFidgetSpinner,
  IconPackages,
  IconPlus,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useMemo } from 'react';

import * as api from '../../../core/api';
import { PaginatedDataTable } from '../../PaginatedDataTable';

import {
  DrawerController,
  DrawerControllerContent,
} from '@/components/controlled-drawer';
import { FullScreenLoader } from '@/components/full-screen-loader';
import { PageHeader } from '@/components/page-header';
import { SectionCards } from '@/components/section-cards';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DrawerTrigger } from '@/components/ui/drawer';

import { useGetDownloadedModsQuery } from './useGetDownloadedModsQuery';
import { useGetServerModsQuery } from './useGetServerModsQuery';

import type { ModItem, Server } from '@dayzserver/sdk/schema';
import type { ColumnDef } from '@tanstack/react-table';
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
          <AddServerModDrawer serverId={server.id}>
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

function AddServerModDrawer({
  serverId,
  isOpen,
  children,
}: PropsWithChildren<{ serverId: string; isOpen?: boolean }>) {
  return (
    <DrawerController isOpen={isOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerControllerContent className="flex flex-col mx-4 min-h-3/4 max-h-3/4">
        <AddServerModListContainer serverId={serverId} />
      </DrawerControllerContent>
    </DrawerController>
  );
}

function AddServerModListContainer({ serverId }: { serverId: string }) {
  const queryClient = useQueryClient();
  const installedModsQuery = useGetServerModsQuery({ serverId });
  const downloadedModsQuery = useGetDownloadedModsQuery();

  const installModFn = useServerFn(api.mods.installModToServer);
  const installModMutation = useMutation({
    mutationFn: installModFn,
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: useGetServerModsQuery.createKey({ serverId }),
      });
    },
  });
  const uninstallModFn = useServerFn(api.mods.uninstallModFromServer);
  const uninstallModMutation = useMutation({
    mutationFn: uninstallModFn,
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: useGetServerModsQuery.createKey({ serverId }),
      });
    },
  });

  const installingModId = useMemo(() => {
    if (installModMutation.isPending) {
      return installModMutation.variables?.data?.modId;
    }

    return;
  }, []);

  const uninstallingModId = useMemo(() => {
    if (uninstallModMutation.isPending) {
      return uninstallModMutation.variables?.data?.modId;
    }

    return;
  }, []);

  const columns = useMemo(
    () =>
      createServerInstallableModColumns({
        installedModIds: installedModsQuery.data?.map((m) => m.id) || [],
        uninstallingModId,
        installingModId,
        onInstallClick: (modId: string) => {
          installModMutation.mutate({
            data: {
              modId,
              serverId,
            },
          });
        },
        onUninstallClick: (modId: string) => {
          uninstallModMutation.mutate({
            data: {
              modId,
              serverId,
            },
          });
        },
      }),
    [installModMutation, installingModId],
  );

  if (downloadedModsQuery.isPending) return <FullScreenLoader />;

  return (
    <PaginatedDataTable
      data={downloadedModsQuery.data || []}
      columns={columns}
    />
  );
}

function createServerInstallableModColumns({
  installedModIds,
  installingModId,
  uninstallingModId,
  onInstallClick,
  onUninstallClick,
}: {
  installedModIds: string[];
  installingModId?: string;
  uninstallingModId?: string;
  onInstallClick: (modId: string) => void;
  onUninstallClick: (modId: string) => void;
}) {
  const columns: ColumnDef<ModItem>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 min-w-96">
          <span>
            {row.original.name}{' '}
            <Badge variant="secondary">{row.original.identifier}</Badge>
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end">
          {installedModIds.includes(row.original.id) && (
            <Button
              disabled={installingModId === row.original.id}
              variant="secondary"
              onClick={() => {
                onUninstallClick(row.original.id);
              }}
            >
              {uninstallingModId === row.original.id ? (
                <IconFidgetSpinner className="animation-spin" />
              ) : (
                <IconDownloadOff />
              )}
              Uninstall
            </Button>
          )}
          {!installedModIds.includes(row.original.id) && (
            <Button
              disabled={installingModId === row.original.id}
              variant="secondary"
              onClick={() => {
                onInstallClick(row.original.id);
              }}
            >
              {installingModId === row.original.id ? (
                <IconFidgetSpinner className="animation-spin" />
              ) : (
                <IconDownload />
              )}
              Install
            </Button>
          )}
        </div>
      ),
    },
  ];
  return columns;
}
