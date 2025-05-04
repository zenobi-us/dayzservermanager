import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from ":components/ui/pagination";


export const ModSearchPagination = ({
    currentPage,
    totalPages,
    isSearching,
    onNextPageClick,
    onPreviousPageClick
}: {
    isSearching?: boolean;
    currentPage: number;
    totalPages: number;
    onNextPageClick: () => void;
    onPreviousPageClick: () => void;
}) => {
    const isNextDisabled = isSearching || currentPage >= totalPages
    const isPreviousDisabled = isSearching || currentPage <= 1

    return (
        <div className="flex w-full justify-betwee">
            <Pagination>
                <div className="text-muted-foreground flex flex-grow">
                    Page {currentPage} of {totalPages}
                </div>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            className={isPreviousDisabled ? "text-muted-foreground" : ""}
                            onClick={() => {
                                if (isPreviousDisabled) {
                                    return
                                }
                                onPreviousPageClick()
                            }}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            className={isNextDisabled ? "text-muted-foreground" : ""}
                            onClick={() => {
                                if (isNextDisabled) {
                                    return
                                }
                                onNextPageClick()
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination >
        </div>
    )
}