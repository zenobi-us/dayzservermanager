import { IconPlus, } from '@tabler/icons-react';
import { SteamWorkshopSearchResults } from '@dayzserver/sdk';

import { Button } from '@/components/ui/button';
import { DrawerCloseButton } from '@/components/drawer-close-button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ErrorNotice } from '@/components/error-notice';

import { ModSearchForm } from './ModSearchForm';
import { ModSearchResults } from './ModSearchResults';
import { ModSearchPagination } from './ModSearchPagination';
import { useStore } from '@tanstack/react-store';
import { modSearchStore, setSearchText, useModSearchQuery } from './useModSearch';
import { FullScreenLoader } from '@/components/full-screen-loader';
import { useMemo } from 'react';


export function ModSearchDrawerContainer() {
    const page = useStore(modSearchStore, (state) => state.page)
    const search_text = useStore(modSearchStore, (state) => state.search_text)
    const numperpage = useStore(modSearchStore, (state) => state.numperpage)
    const modSearchQuery = useModSearchQuery({
        search_text,
        page,
        numperpage
    })

    const pageCount = useMemo(() => {
        const totalResults = modSearchQuery.data?.response.total;
        if (!totalResults) {
            return 0
        }
        if (totalResults < numperpage) {
            return 1
        }
        return Math.ceil(totalResults / numperpage)
    }, [modSearchQuery, numperpage])

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline">
                    <IconPlus className='mr-2' /> Add mod
                </Button>
            </DrawerTrigger>
            <DrawerContent className='flex flex-col mx-4 min-h-3/4 max-h-3/4'>
                <DrawerHeader className='relative'>
                    <div className="flex flex-grow jusitfy-start items-end gap-4 pt-4">
                        <div className="flex flex-col gap-2 min-w-1/4">
                            <DrawerTitle>Search for mods</DrawerTitle>
                            <DrawerDescription>find and install a mod.</DrawerDescription>
                        </div>
                        <ModSearchForm
                            onSubmit={(query) => {
                                setSearchText(query.search_text)
                            }}
                        />
                        <DrawerCloseButton />
                    </div>
                </DrawerHeader>
                <ModSearchDrawerResults
                    currentPage={page}
                    pageCount={pageCount}
                    pageSize={numperpage}
                    publishedfiledetails={modSearchQuery.data?.response.publishedfiledetails || []}
                    error={modSearchQuery.error?.message || ""}
                    total={modSearchQuery.data?.response.total || 0}
                    isFetching={modSearchQuery.isFetching}
                    isPending={modSearchQuery.isPending}
                    onNextPageClick={() => {
                        modSearchStore.setState((state) => {
                            const page = state.page + 1 > pageCount ? 1 : state.page + 1;
                            return ({ ...state, page })
                        });
                    }}
                    onPreviousPageClick={() => {
                        modSearchStore.setState((state) => {
                            const page = state.page - 1 < 1 ? pageCount : state.page - 1;
                            return ({ ...state, page })
                        });
                    }}

                />
            </DrawerContent>
        </Drawer>
    )
}

function ModSearchDrawerResults({
    error,
    isFetching,
    isPending,
    publishedfiledetails,
    total,
    pageSize,
    pageCount,
    currentPage,
    onNextPageClick,
    onPreviousPageClick
}: {
    error: string;
    isPending?: boolean;
    isFetching?: boolean;
    total: number;
    pageSize: number;
    currentPage: number;
    pageCount: number;
    publishedfiledetails: SteamWorkshopSearchResults['response']['publishedfiledetails'];
    onNextPageClick: () => void;
    onPreviousPageClick: () => void;
}) {


    return (
        <>
            <div className="overflow-y-scroll rounded-md border m-2 p-2 flex flex-col flex-grow">
                {error && (
                    <ErrorNotice>{error}</ErrorNotice>
                )}
                {isFetching && (
                    <FullScreenLoader />
                )}
                {!isPending && (
                    <ModSearchResults
                        className="block overflow-visible"
                        publishedfiledetails={publishedfiledetails}
                        total={total}
                    />
                )}
            </div>

            <DrawerFooter>
                <ModSearchPagination
                    totalPages={pageCount}
                    currentPage={currentPage}
                    onNextPageClick={onNextPageClick}
                    onPreviousPageClick={onPreviousPageClick}
                />
            </DrawerFooter>
        </>
    )
}