import { useNavigate } from '@tanstack/react-router';

import { SectionCards } from ':components/section-cards';

import type { ModItemList, Server } from '@dayzserver/sdk/schema';

export function DashboardPage({
  servers = [],
  mods = [],
}: {
  servers?: Server[];
  mods?: ModItemList;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards>
            <ServerCard servers={servers} />
            <SteamModCard mods={mods} />
          </SectionCards>
        </div>
      </div>
    </div>
  );
}

function SteamModCard({ mods }: { mods: ModItemList }) {
  const navigate = useNavigate();

  return (
    <SectionCards.Item
      title="mods"
      description={`${mods.length} activated mods`}
      onClick={() => {
        navigate({
          to: '/d/mods',
        }).catch(console.error);
      }}
    />
  );
}

function ServerCard({ servers }: { servers: Server[] }) {
  const navigate = useNavigate();
  return (
    <SectionCards.Item
      title="servers"
      description={`${servers.length} servers`}
      onClick={() => {
        navigate({
          to: '/d/servers',
        }).catch(console.error);
      }}
    />
  );
}
