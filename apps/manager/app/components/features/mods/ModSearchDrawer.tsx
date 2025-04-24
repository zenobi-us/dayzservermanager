import { IconCircleX, IconPlus, } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ModSearchResults } from './ModSearchResults';
import { cn } from '@/lib/utils';
import { ModSearchForm } from './ModSearchForm';
import { ModSearchPagination } from './ModSearchPagination';
import { modSearchStore, resetSearch, search, useModSearchQuery } from './useModSearch';
import { useMemo } from 'react';
import { isErrorResponse } from '@/types/response';
import { useStore } from '@tanstack/react-store';
import { ErrorNotice } from '@/components/error-notice';


export function ModSearchDrawerContainer() {
    return (
        <Drawer onClose={() => {
            resetSearch()
        }}>
            <DrawerTrigger asChild>
                <Button variant="outline">
                    <IconPlus className='mr-2' /> Add mod
                </Button>
            </DrawerTrigger>
            <DrawerContent className='flex flex-col mx-4 min-h-3/4 max-h-3/4'>
                <DrawerHeader className='relative'>
                    <div className="flex flex-grow jusitfy-start items-end gap-4">
                        <div className="flex flex-col gap-2 min-w-1/4">
                            <DrawerTitle>Search for mods</DrawerTitle>
                            <DrawerDescription>find and install a mod.</DrawerDescription>
                        </div>
                        <ModSearchForm />
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
                <ModSearchDrawerResults />
            </DrawerContent>
        </Drawer>
    )
}

function ModSearchDrawerResults() {
    const search_text = useStore(modSearchStore, (data) => data.search_text);
    const page = useStore(modSearchStore, (data) => data.page);
    const numperpage = useStore(modSearchStore, (data) => data.numperpage);

    const query = useModSearchQuery({
        search_text,
        page,
        numperpage
    });

    const error = useMemo(() => {
        if (query.isFetching) {
            return
        }
        if (!isErrorResponse(query.data?.data)) {
            return
        }
        if (typeof query.data.data.error === 'string') {
            return query.data.data.error;
        }

        return query.data.data.error?.message;
    }, [query.data?.data])

    const response = useMemo(() => {
        if (query.isFetching) {
            return null
        }

        if (typeof query.data?.data === 'string') {
            return null
        }
        if (isErrorResponse(query.data?.data)) {
            return null
        }

        return query.data?.data?.response
    }, [query.data?.data])


    const pageCount = useMemo(() => {
        if (!response?.total) { return 0 }
        return Math.ceil(response?.total / numperpage);
    }, [response, numperpage])

    return (
        <>
            <div className="overflow-y-scroll rounded-md border m-2 p-2 flex flex-col flex-grow">
                {error && (
                    <ErrorNotice>{error}</ErrorNotice>
                )}
                {!query.isFetching && !!response && (
                    <ModSearchResults
                        className="block overflow-visible"
                        publishedfiledetails={response.publishedfiledetails}
                        total={response.total}
                    />
                )}
            </div>

            {!query.isFetching && pageCount && (
                <DrawerFooter>
                    <ModSearchPagination
                        totalPages={pageCount}
                        isSearching={query.isFetching}
                        currentPage={page}
                        onNextPageClick={() => search({ page: page + 1 })}
                        onPreviousPageClick={() => search({ page: page - 1 })}
                    />
                </DrawerFooter>
            )}
        </>
    )
}