import {
  IconBusStop,
  IconDownload,
  IconDownloadOff,
  IconFidgetSpinner,
  IconLoader,
  IconReload,
  IconShip,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { createContext, useContext, useMemo } from 'react';

import { Container } from ':components/container';
import {
  DrawerController,
  DrawerControllerContent,
} from ':components/controlled-drawer';
import { FullScreenLoader } from ':components/full-screen-loader';
import { Page } from ':components/page';
import { PageHeader } from ':components/page-header';
import { Text } from ':components/text';
import { Badge } from ':components/ui/badge';
import { AsyncButton, Button } from ':components/ui/button';
import { Card, CardContent } from ':components/ui/card';
import { DefinitionData } from ':components/ui/definition-data-list';
import { Divider } from ':components/ui/divider';
import { DrawerTrigger } from ':components/ui/drawer';
import { SectionHeading } from ':components/ui/headings';
import { SeparatedBy } from ':components/ui/separated-by';

import * as api from '../../../core/api';
import { PaginatedDataTable } from '../../PaginatedDataTable';

import { useGetDownloadedModsQuery } from './useGetDownloadedModsQuery';
import { useGetServerDetailQuery } from './useGetServerDetailQuery';
import { useGetServerModsQuery } from './useGetServerModsQuery';
import {
  useCreateServerContainerMutation,
  useRemoveServerContainerMutation,
  useRestartServerContainerMutation,
  useStartServerContainerMutation,
  useStopServerContainerMutation,
} from './useServerContainerMutation';

import type { ModItem, Server } from '@dayzserver/sdk/schema';
import type { ColumnDef } from '@tanstack/react-table';
import type { PropsWithChildren } from 'react';

const ServerDetailContext = createContext<{
  server: Server | null | undefined;
  isLoading?: boolean;
} | null>(null);

const ServerDetailProvider = ({
  serverId,
  children,
}: PropsWithChildren<{ serverId: string }>) => {
  const serverQuery = useGetServerDetailQuery({ serverId });

  return (
    <ServerDetailContext.Provider
      value={{
        server: serverQuery.data,
        isLoading: serverQuery.isPending,
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

export function ServerDetailPageContainer({ serverId }: { serverId: string }) {
  return (
    <ServerDetailProvider serverId={serverId}>
      <ServerDetailPage />
    </ServerDetailProvider>
  );
}
function ServerDetailPage() {
  return (
    <Page>
      <ServerDetailHeader />
      <Container className="grid grid-cols-2">
        <ServerDetails />
        <ServerContainerCard />
      </Container>
      <Divider />
      <ServerModList />
    </Page>
  );
}

function ServerDetailHeader() {
  const details = useServerDetails();

  if (!details.server) {
    return null;
  }

  return (
    <PageHeader title={details.server.id}>
      <SeparatedBy>
        <ServerContainerStatus />
        <ServerUptime />
      </SeparatedBy>
    </PageHeader>
  );
}

function ServerDetails() {
  const details = useServerDetails();
  const server = details.server;

  if (!server || server.error) {
    return null;
  }
  return (
    <DefinitionData.List>
      <DefinitionData.Item label="Map">{server.map}</DefinitionData.Item>
      <DefinitionData.Item label="Max Players">
        {server.config.maxPlayers}
      </DefinitionData.Item>
      <DefinitionData.Item label="Login Queue Size">
        {server.config.loginQueueConcurrentPlayers}
      </DefinitionData.Item>
    </DefinitionData.List>
  );
}

function ServerModList() {
  const details = useServerDetails();
  const serverId = details.server?.id;

  const installedModsQuery = useGetServerModsQuery({
    serverId,
  });

  return (
    <Container className="flex-col gap-2">
      <SectionHeading
        title="Mods"
        subtitle={`${installedModsQuery.data?.length} activated mods`}
      >
        <AddServerModDrawer>
          <Button variant="outline">Add mods</Button>
        </AddServerModDrawer>
      </SectionHeading>

      {!installedModsQuery.isPending && (
        <PaginatedDataTable
          columns={[
            {
              id: 'name',
              header: 'Name',
              cell: ({ row }) => (
                <div className="flex items-center space-x-2 min-w-96">
                  <span>{row.original.name}</span>
                </div>
              ),
            },
            {
              id: 'identifier',
              header: 'Identifier',
              cell: ({ row }) => (
                <Badge variant="secondary">{row.original.identifier}</Badge>
              ),
            },
          ]}
          data={installedModsQuery.data || []}
        />
      )}
    </Container>
  );
}

function AddServerModDrawer({
  isOpen,
  children,
}: PropsWithChildren<{
  isOpen?: boolean;
}>) {
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
  const serverId = server?.id;
  const queryClient = useQueryClient();
  const handleInvalidateQuery = async () => {
    await queryClient.resetQueries({
      queryKey: useGetServerModsQuery.createKey({ serverId }),
    });
  };

  const installedModsQuery = useGetServerModsQuery({ serverId });
  const downloadedModsQuery = useGetDownloadedModsQuery();

  const installModMutation = useMutation({
    mutationFn: useServerFn(api.mods.installModToServer),
    async onSuccess() {
      await handleInvalidateQuery();
    },
  });

  const uninstallModMutation = useMutation({
    mutationFn: useServerFn(api.mods.uninstallModFromServer),
    async onSuccess() {
      await handleInvalidateQuery();
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
          if (!serverId) {
            return;
          }
          installModMutation.mutate({
            data: {
              modId,
              serverId,
            },
          });
        },
        onUninstallClick: (modId: string) => {
          if (!serverId) {
            return;
          }
          uninstallModMutation.mutate({
            data: {
              modId,
              serverId,
            },
          });
        },
      }),
    [
      installModMutation,
      uninstallModMutation,
      installingModId,
      uninstallingModId,
    ],
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

function ServerContainerCard() {
  const details = useServerDetails();
  const createServerContainerMutation = useCreateServerContainerMutation(
    details.server,
  );
  const startServerContainerMutation = useStartServerContainerMutation(
    details.server,
  );
  const removeServerContainerMutation = useRemoveServerContainerMutation(
    details.server,
  );
  const restartServerContainerMutation = useRestartServerContainerMutation(
    details.server,
  );
  const stopServerContainerMutation = useStopServerContainerMutation(
    details.server,
  );
  const container = details.server?.container;

  return (
    <Card>
      {!container && (
        <CardContent className="items-center justify-center flex flex-grow">
          <Button
            variant="outline"
            onClick={() => {
              createServerContainerMutation.mutate();
            }}
            disabled={createServerContainerMutation.isPending}
          >
            <Text>Create Container</Text>
            {createServerContainerMutation.isPending && (
              <IconLoader className="animate-spin" />
            )}
          </Button>
        </CardContent>
      )}
      {!!container && (
        <CardContent className="flex flex-col gap-2 flex-grow">
          <ServerContainerStatus />
          <div className="items-center justify-center flex flex-col gap-2 flex-grow">
            <AsyncButton
              variant="outline"
              loading={startServerContainerMutation.isPending}
              onClick={() => {
                startServerContainerMutation.mutate();
              }}
            >
              Start Container
            </AsyncButton>
            <AsyncButton
              variant="outline"
              loading={stopServerContainerMutation.isPending}
              onClick={() => {
                stopServerContainerMutation.mutate();
              }}
            >
              Stop Container
            </AsyncButton>
            <AsyncButton
              variant="outline"
              loading={restartServerContainerMutation.isPending}
              onClick={() => {
                restartServerContainerMutation.mutate();
              }}
            >
              Restart Container
            </AsyncButton>
            <AsyncButton
              variant="destructive"
              loading={removeServerContainerMutation.isPending}
              onClick={() => {
                removeServerContainerMutation.mutate();
              }}
            >
              Remove Container
            </AsyncButton>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function ServerContainerStatus() {
  const details = useServerDetails();

  if (details.isLoading || !details.server?.container) {
    return;
  }

  const state = details.server.container.State;

  if (state.Running) {
    return (
      <Badge variant="outline">
        <IconShip />
        Running
      </Badge>
    );
  }

  if (state.Restarting) {
    return (
      <Badge variant="outline">
        <IconReload />
        Restarting
      </Badge>
    );
  }

  if (state.Status === 'created') {
    return (
      <Badge variant="outline">
        <IconBusStop />
        Stopped
      </Badge>
    );
  }

  return <Badge variant="cautious">{state.Status}</Badge>;
}

function ServerUptime() {
  const details = useServerDetails();
  if (!details.server?.container) {
    return null;
  }

  if (details.server?.container.State.Dead) {
    return (
      <Badge>
        <Text>Created: {details.server.container?.Created}</Text>
      </Badge>
    );
  }

  if (details.server?.container.State.Running) {
    return (
      <Badge>
        <Text>Created: {details.server.container?.Created}</Text>
      </Badge>
    );
  }

  return null;
}
