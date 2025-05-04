// import presetReact from '@bbob/preset-react';
// import BBCode from '@bbob/react';
import {
  IconCancel,
  IconLanguage,
  IconStar,
  IconUsersGroup,
  IconVersions,
} from '@tabler/icons-react';
import { useCallback } from 'react';

import { DrawerCloseButton } from ':components/drawer-close-button';
import { Badge } from ':components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from ':components/ui/card';
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  NestedDrawer,
} from ':components/ui/drawer';
import { cn } from ':lib/utils';

import { DownloadModButton } from './DownloadModButton';
import { ModResultItemHeader } from './ModResultItemHeader';

import type { SteamWorkshopSearchResults } from '@dayzserver/sdk/schema';

// const BBCodePlugins = [presetReact()];

export function ModResultItemDrawer({
  item,
}: {
  item: SteamWorkshopSearchResults['response']['publishedfiledetails'][number];
}) {
  const Badges = useCallback(() => {
    return (
      <div className="flex flex-wrap gap-1">
        <Badge title="subscriptions / lifetime subscriptions">
          <IconStar /> {item.subscriptions} ({item.lifetime_subscriptions})
        </Badge>
        <Badge title="followers / lifetime followers" variant="secondary">
          <IconUsersGroup /> {item.followers} ( {item.lifetime_followers})
        </Badge>
        {!item.can_subscribe && (
          <Badge title="Unavailable for subscription" variant="destructive">
            <IconCancel /> unavailable
          </Badge>
        )}
        {item.banned && (
          <Badge title={item.ban_reason} variant="destructive">
            <IconCancel /> banned
          </Badge>
        )}
        <Badge title="language" variant="secondary">
          <IconLanguage /> {item.language}
        </Badge>
        <Badge title="version" variant="secondary">
          <IconVersions /> {item.revision}.{item.revision_change_number}
        </Badge>
      </div>
    );
  }, [item]);

  return (
    <NestedDrawer>
      <DrawerTrigger asChild>
        <Card>
          <CardHeader>
            <ModResultItemHeader onDownloadClick={() => {}}>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>
                <Badges />
              </CardDescription>
            </ModResultItemHeader>
          </CardHeader>
          <CardContent className="grid gap-4"></CardContent>
          <CardFooter></CardFooter>
        </Card>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col mx-4 min-h-3/4 max-h-3/4 ">
        <DrawerHeader
          className={cn(
            'relative min-h-96',
            'bg-cover bg-center bg-no-repeat bg-[image:var(--image-url)]',
          )}
          style={{
            //@ts-expect-error reasons
            '--image-url': `url(${item.preview_url})`,
          }}
        >
          <div
            className={cn(
              'absolute top-0 bottom-0 right-0 left-0 p-4 flex flex-grow jusitfy-end items-end gap-4',
              'bg-linear-to-t from-black/45 to-transparent',
            )}
          >
            <div className="flex flex-col gap-2 min-w-1/4">
              <DrawerTitle className="text-gray-100 text-shadow-2xs">
                {item.title}
              </DrawerTitle>
              <DrawerDescription className="text-white text-shadow-2xs">
                {' '}
                by {item.creator}
              </DrawerDescription>
            </div>
            <DrawerCloseButton />
            <DownloadModButton modId={item.publishedfileid} />
          </div>
        </DrawerHeader>
        <div className="overflow-y-scroll rounded-md border m-2 p-2 flex flex-col flex-grow">
          {/* <BBCode plugins={BBCodePlugins}>{item.short_description}</BBCode> */}
        </div>
      </DrawerContent>
    </NestedDrawer>
  );
}
