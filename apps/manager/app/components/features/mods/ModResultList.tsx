import { Badge } from "@/components/ui/badge";
import { PageSectionGrid } from "../../page-section-grid";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger, NestedDrawer } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { SteamWorkshopSearchResults } from "@dayzserver/sdk";
import { IconCancel, IconCircleX, IconDownload, IconLanguage, IconStar, IconUsersGroup, IconVersions } from "@tabler/icons-react";
import { PropsWithChildren, useCallback } from "react";
import { Button } from "@/components/ui/button";

export function ModSearchResultList({ results, total }: {
    results: SteamWorkshopSearchResults['response']['publishedfiledetails'],
    total: SteamWorkshopSearchResults['response']['total'],
}) {

    return (
        <PageSectionGrid>
            {results.map((item) => (
                <ModResultItem item={item} />
            ))}
        </PageSectionGrid>
    )
}

const ModResultItemHeader = ({ children, onDownloadClick }: PropsWithChildren<
    {
        onDownloadClick: () => void
    }
>) => {
    return (
        <div className="grid grid-flow-row gap-4 grid-cols-(--grid-cols)"
        >
            <div className="col-span-4 md:col-span-2">
                {children}
            </div>
            <Button variant='outline' size='sm' className="col-span-2 md:col-span-1">
                <IconDownload /> Download
            </Button>
        </div>

    )
}

function ModResultItem({ item }: { item: SteamWorkshopSearchResults['response']['publishedfiledetails'][number] }) {

    const Badges = useCallback(() => {
        return (
            <div className="flex flex-wrap gap-1">
                <Badge title="subscriptions / lifetime subscriptions"><IconStar /> {item.subscriptions} ({item.lifetime_subscriptions})</Badge>
                <Badge title="followers / lifetime followers" variant='secondary'><IconUsersGroup /> {item.followers} ( {item.lifetime_followers})</Badge>
                {!item.can_subscribe && (
                    <Badge title='Unavailable for subscription' variant='destructive'><IconCancel /> unavailable</Badge>
                )}
                {item.banned && (
                    <Badge title={item.ban_reason} variant='destructive'><IconCancel /> banned</Badge>
                )}
                <Badge title="language" variant='secondary'><IconLanguage /> {item.language}</Badge>
                <Badge title="version" variant='secondary'><IconVersions /> {item.revision}.{item.revision_change_number}</Badge>
            </div>
        )
    }, [item])

    return (
        <NestedDrawer>
            <DrawerTrigger asChild>
                <Card>
                    <CardHeader>
                        <ModResultItemHeader onDownloadClick={() => { }}>
                            <CardTitle>{item.title}</CardTitle>
                            <CardDescription>
                                <Badges />
                            </CardDescription>
                        </ModResultItemHeader>
                    </CardHeader>
                    <CardContent className="grid gap-4">

                    </CardContent>
                    <CardFooter>
                    </CardFooter>
                </Card>
            </DrawerTrigger>
            <DrawerContent className='flex flex-col mx-4 min-h-3/4 max-h-3/4'>
                <DrawerHeader className='relative'>
                    <div className="flex flex-grow jusitfy-start items-end gap-4">
                        <div className="flex flex-col gap-2 min-w-1/4">
                            <DrawerTitle>{item.title}</DrawerTitle>
                            <DrawerDescription> by {item.creator}</DrawerDescription>
                        </div>

                        <DrawerClose className={cn(
                            'absolute -top-10 right-5 cursor-pointer border-4 rounded-full border-white bg-white',
                        )}>
                            <IconCircleX
                                size={32}
                                className='stroke-gray-400 hover:stroke-black'
                            />
                        </DrawerClose>
                    </div>
                </DrawerHeader>
                <div className="overflow-y-scroll rounded-md border m-2 p-2 flex flex-col flex-grow">
                    {item.short_description}
                </div>
            </DrawerContent>
        </NestedDrawer>
    )
}