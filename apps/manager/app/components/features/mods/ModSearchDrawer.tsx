import { IconPlus } from '@tabler/icons-react';

import { DrawerCloseButton } from ':components/drawer-close-button';
import { ErrorNotice } from ':components/error-notice';
import { FullScreenLoader } from ':components/full-screen-loader';
import { Button } from ':components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from ':components/ui/drawer';

import { ModSearchForm } from './ModSearchForm';
import { ModSearchPagination } from './ModSearchPagination';
import { ModSearchResults } from './ModSearchResults';
import { useModSearchMutation } from './useModSearch';

import type { SteamWorkshopSearchResults } from '@dayzserver/sdk/schema';

export function ModSearchDrawerContainer() {
  const modSearchMutation = useModSearchMutation();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <IconPlus className="mr-2" /> Add mod
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col mx-4 min-h-3/4 max-h-3/4">
        <DrawerHeader className="relative">
          <div className="flex flex-grow jusitfy-start items-end gap-4 pt-4">
            <div className="flex flex-col gap-2 min-w-1/4">
              <DrawerTitle>Search for mods</DrawerTitle>
              <DrawerDescription>find and install a mod.</DrawerDescription>
            </div>
            <ModSearchForm
              onSubmit={(query) => {
                modSearchMutation.search(query);
              }}
            />
            <DrawerCloseButton />
          </div>
        </DrawerHeader>

        <ModSearchDrawerResults
          currentPage={modSearchMutation.page}
          pageCount={modSearchMutation.pageCount}
          pageSize={modSearchMutation.numperpage}
          publishedfiledetails={modSearchMutation.results}
          error={modSearchMutation.error || ''}
          total={modSearchMutation.total}
          isFetching={modSearchMutation.isPending}
          onNextPageClick={() => {
            modSearchMutation.search({
              page:
                modSearchMutation.page + 1 > modSearchMutation.pageCount
                  ? 1
                  : modSearchMutation.page + 1,
            });
          }}
          onPreviousPageClick={() => {
            modSearchMutation.search({
              page:
                modSearchMutation.page - 1 < 1
                  ? modSearchMutation.pageCount
                  : modSearchMutation.page - 1,
            });
          }}
        />
      </DrawerContent>
    </Drawer>
  );
}

function ModSearchDrawerResults({
  error,
  isFetching,
  publishedfiledetails,
  total,
  //   pageSize,
  pageCount,
  currentPage,
  onNextPageClick,
  onPreviousPageClick,
}: {
  error: string;
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
        {error && <ErrorNotice>{error}</ErrorNotice>}
        {isFetching && <FullScreenLoader />}
        {!isFetching && (
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
  );
}
