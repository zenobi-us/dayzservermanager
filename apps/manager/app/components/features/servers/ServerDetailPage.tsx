import { ServerExistanceStatus } from '@dayzserver/sdk/schema';
import {
  IconDotsVertical,
  IconDownload,
  IconDownloadOff,
  IconFidgetSpinner,
  IconLoader,
  IconPackageImport,
  IconPackages,
  IconPlayerPlay,
  IconPlayerStop,
  IconUpload,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { createContext, useContext, useMemo } from 'react';

import * as api from '../../../core/api';
import { PaginatedDataTable } from '../../PaginatedDataTable';

import {
  DrawerController,
  DrawerControllerContent,
} from '@/components/controlled-drawer';
import { FullScreenLoader } from '@/components/full-screen-loader';
import { Page } from '@/components/page';
import { PageHeader } from '@/components/page-header';
import { SectionCards } from '@/components/section-cards';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DrawerTrigger } from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useGetDownloadedModsQuery } from './useGetDownloadedModsQuery';
import { useGetServerModsQuery } from './useGetServerModsQuery';

import type { ModItem, Server } from '@dayzserver/sdk/schema';
import type { ColumnDef } from '@tanstack/react-table';
import type { PropsWithChildren } from 'react';

const ServerDetailContext = createContext<{
  server: Server;
  isLoading?: boolean;
  status: ServerExistanceStatus;
} | null>(null);

const computeServerStatus = (server?: Server) => {
  if (server && server.container?.Created) {
    return ServerExistanceStatus.Exists;
  }

  if (server && server.container && !server.container.Created) {
    return ServerExistanceStatus.Creating;
  }

  return ServerExistanceStatus.DoesNotExist;
};

const ServerDetailProvider = ({
  server,
  children,
}: PropsWithChildren<{ server: Server }>) => {
  const status = computeServerStatus(server);
  const isLoading = status === ServerExistanceStatus.Creating;

  return (
    <ServerDetailContext.Provider
      value={{
        server,
        status,
        isLoading,
      }}
    >
      {children}
    </ServerDetailContext.Provider>
  );
};

const useServerDetails = () => {
  const context = useContext(ServerDetailContext);
  if (!context) {
    throw new Error('useServer must be used within a ServerDetailProvider');
  }
  return context;
};

export function ServerDetailPage({ server }: { server: Server }) {
  return (
    <ServerDetailProvider server={server}>
      <Page>
        <ServerDetailHeader />
        <SectionCards>
          <ServerMapCard />
          <ServerModCard />
        </SectionCards>
      </Page>
    </ServerDetailProvider>
  );
}

function useCreateServerContainerMutation(server?: Server) {
  const queryClient = useQueryClient();
  const createServerContainerFn = useServerFn(api.server.createServerContainer);
  return useMutation({
    mutationFn: async () => {
      if (!server) {
        return;
      }

      return await createServerContainerFn({
        data: {
          serverId: server.id,
        },
      });
    },
    async onSuccess() {
      if (!server) {
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['servers'] });
      await queryClient.invalidateQueries({ queryKey: ['server', server.id] });
    },
  });
}

function ServerDetailHeader() {
  const details = useServerDetails();
  const createServerContainerMutation = useCreateServerContainerMutation(details.server);
  const isCreatingContainer = createServerContainerMutation.isPending;
  return (
    <PageHeader
      title={details.server.id}
      actions={
        <div>
          <AddServerModDrawer>
            <Button>
              <IconPackageImport /> Add Mod
            </Button>
          </AddServerModDrawer>

          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              {!isCreatingContainer && <IconDotsVertical />}
              {isCreatingContainer && <IconLoader className="animate-spin" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuLabel className="text-sm font-bold">
                Docker
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {!details.server.container?.Created && (
                <DropdownMenuItem
                  // disabled={isCreatingContainer}
                  onClick={() => {
                    createServerContainerMutation.mutate();
                  }}
                >
                  <IconUpload /> Create
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                disabled={
                  !details.server.container?.Created ||
                  details.server.container?.State === 'running'
                }
              >
                <IconPlayerPlay /> Start
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={
                  !details.server.container?.Created ||
                  details.server.container?.State !== 'running'
                }
              >
                <IconPlayerStop /> Stop
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    ></PageHeader>
  );
}

function ServerMapCard() {
  const details = useServerDetails();
  const server = details.server;

  if (server.error) {
    return null;
  }
  return <SectionCards.Item title="map" description={server.map} />;
}

function ServerModCard() {
  const navigate = useNavigate();
  const details = useServerDetails();
  const server = details.server;

  const mods = useMemo(() => (!server.error && server.mods) || [], [server]);

  return (
    <SectionCards.Item
      title="mods"
      description={`${mods.length} activated mods`}
      onClick={() => {
        navigate({
          to: '/servers/$serverId/mods',
          params: { serverId: server.id },
        }).catch(console.error);
      }}
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
  isOpen,
  children,
}: PropsWithChildren<{ isOpen?: boolean }>) {
  return (
    <DrawerController isOpen={isOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerControllerContent className="flex flex-col mx-4 min-h-3/4 max-h-3/4">
        <AddServerModListContainer />
      </DrawerControllerContent>
    </DrawerController>
  );
}

function AddServerModListContainer() {
  const details = useServerDetails();
  const server = details.server;
  const serverId = server.id;

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
