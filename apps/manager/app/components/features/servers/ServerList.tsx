import { useNavigate } from '@tanstack/react-router';

import { Container } from ':components/container';
import { createFiltering } from ':components/filteirng-list';
import { Badge } from ':components/ui/badge';
import { Button } from ':components/ui/button';
import { ItemList } from ':components/ui/item-list';
import { SeparatedBy } from ':components/ui/separated-by';

import type { Server } from '@dayzserver/sdk/schema';

const FilteringServerList = createFiltering<Server>({
  indexer: (item) => item.id,
});

export function ServerList({ servers }: { servers: Server[] }) {
  return (
    <FilteringServerList.Provider items={servers}>
      <Container>
        <FilteringServerList.FilterInput />
        <FilteringServerList.List
          listElement={ItemList}
          itemElement={ServerListItem}
        />
      </Container>
    </FilteringServerList.Provider>
  );
}

function ServerListItem({ item }: { item: Server }) {
  const navigate = useNavigate();

  if (item.error) {
    return (
      <ItemList.Item
        title={item.id}
        annotations={<Badge variant="destructive">error</Badge>}
      />
    );
  }
  return (
    <ItemList.Item
      key={item.id}
      title={item.id}
      annotations={
        <>
          {item.container && (
            <Badge variant="outline" className="text-green-800">
              {item.container?.Status}
            </Badge>
          )}
        </>
      }
      actions={
        <>
          <Button
            variant="outline"
            onClick={() => {
              navigate({
                to: '/d/servers/$serverId',
                params: {
                  serverId: item.id,
                },
              }).catch(console.error);
            }}
          >
            View Server
          </Button>
        </>
      }
    >
      <SeparatedBy>
        <p className="whitespace-nowrap">{item.mods.length} installed mods</p>
      </SeparatedBy>
    </ItemList.Item>
  );
}
