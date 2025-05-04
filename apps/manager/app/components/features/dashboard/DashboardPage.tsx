import { Link } from '@tanstack/react-router';

import { Container } from ':components/container';
import { Page } from ':components/page';
import { Text } from ':components/text';

import type { ModItemList, Server } from '@dayzserver/sdk/schema';

export function DashboardPage({
  servers = [],
  mods = [],
}: {
  servers?: Server[];
  mods?: ModItemList;
}) {
  return (
    <Page className="items-center flex-grow justify-center">
      <Container className="flex-col items-center gap-4">
        <SteamModCard mods={mods} />
      </Container>
      <Container className="flex-col items-center gap-4">
        <ServerCard servers={servers} />
      </Container>
    </Page>
  );
}

function SteamModCard({ mods }: { mods: ModItemList }) {
  return (
    <Link to="/d/mods">
      <Text
        title={`${mods.length} activated mods`}
        className="text-6xl text-secondary-foreground"
      >
        {mods.length} Mods
      </Text>
    </Link>
  );
}

function ServerCard({ servers }: { servers: Server[] }) {
  return (
    <Link to="/d/servers">
      <Text
        title={`${servers.length} servers`}
        className="text-6xl text-secondary-foreground"
      >
        {servers.length} Servers
      </Text>
    </Link>
  );
}
