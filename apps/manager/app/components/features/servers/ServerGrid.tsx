import { IconPackageImport, IconPlus } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

import { SectionCards } from '@/components/section-cards';
import { Card } from '@/components/ui/card';

import { CreateServerDrawer } from './CreateServerDrawer';

import type { Server } from '@dayzserver/sdk/schema';

export function ServerGrid({ servers }: { servers: Server[] }) {
  return (
    <SectionCards>
      <CreateServerDrawer>
        <Card
          className="border-dashed border-2 bg-white shadow-none items-center justify-center cursor-pointer text-muted-foreground hover:text-accent-foreground"
          data-slot="card"
        >
          <IconPlus width={48} height={48} />
          Create server
        </Card>
      </CreateServerDrawer>
      {servers.map((server) => (
        <ServerCard server={server} />
      ))}
    </SectionCards>
  );
}

function ServerCard({ server }: { server: Server }) {
  const navigate = useNavigate();

  if (server.error) {
    return (
      <SectionCards.Item
        className="cursor-pointer"
        key={server.id}
        title={server.id}
      />
    );
  }
  return (
    <SectionCards.Item
      className="cursor-pointer"
      key={server.id}
      title={server.id}
      description={server.map}
      actions={
        <>
          <SectionCardBadgeModCount count={server.mods?.length} />
        </>
      }
      onClick={() => {
        navigate({
          to: '/servers/$serverId',
          params: {
            serverId: server.id,
          },
        }).catch(console.error);
      }}
    />
  );
}

function SectionCardBadgeModCount({ count }: { count?: number }) {
  if (!count || count <= 0) {
    return null;
  }

  return (
    <SectionCards.Badge icon={<IconPackageImport />} label={count.toString()} />
  );
}
