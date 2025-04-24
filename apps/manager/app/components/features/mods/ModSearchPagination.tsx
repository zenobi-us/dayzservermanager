import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { setPage, useModSearch } from "./useModSearch";
import { useMemo } from "react";
import { isErrorResponse } from "@/types/response";

function createPageIdArray(start: number, size: number) {
    return Array.from({ length: size }, (_, i) => {
        return start + i - 1;
    });
}


export const ModSearchPagination = () => {
    const search = useModSearch()

    const totalRecords = useMemo(() => {
        const data = search.query.data?.data
        if (!data) {
            return null
        }
        if (typeof data === 'string') {
            return null
        }

        if (isErrorResponse(data)) {
            return null
        }

        return data.response.total;
    }, [search.query.data?.data])

    const pageCount = useMemo(() => {
        if (!totalRecords) { return null }

        const size = search.store.numperpage
        const pages = Math.ceil(totalRecords / size);

        return pages
    }, [totalRecords, search.store.numperpage])

    const left = useMemo(() => {
        if (pageCount === null) { return null }

        if (pageCount < 5) {
            return createPageIdArray(search.store.page, 4)
        }

        // if 5 or more pages, then show the first three and an ellipsis
        return createPageIdArray(search.store.page, 3)
    }, [pageCount])

    const right = useMemo(() => {
        if (pageCount === null) { return null }
        // don't bother showing ellipsis if there are only 5 pages or less
        if (pageCount <= 5) { return null }

        return createPageIdArray(search.store.page + 5, 1)
    }, [pageCount])

    return (
        <Pagination>
            <PaginationContent>
                {search.store.page > 1 && (
                    <PaginationItem>
                        <PaginationPrevious onClick={() => {
                            setPage(search.store.page - 1)
                        }} />
                    </PaginationItem>
                )}
                {left && left.map((pageId) => {
                    return (
                        <PaginationItem>
                            <PaginationLink onClick={() => { setPage(pageId) }}>{pageId}</PaginationLink>
                        </PaginationItem>
                    )
                })}
                <PaginationItem>
                    <PaginationLink href="#" isActive>
                        2
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>

                <PaginationItem>
                    <PaginationNext href="#" />
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    )
}