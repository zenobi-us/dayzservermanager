import { PaginatedDataTable } from '../../PaginatedDataTable';

import { Page } from '@/components/page';
import { PageHeader } from '@/components/page-header';
import { PageSection } from '@/components/page-section';

import { modListTableColumns } from './ModListTableColumns';
import { ModSearchDrawerContainer } from './ModSearchDrawer';

import type { ModItemList } from '@dayzserver/sdk/schema';
import type { ComponentProps } from 'react';

export function ModListDashboardPage({
  data = [],
}: Omit<ComponentProps<typeof PaginatedDataTable>, 'data' | 'columns'> & {
  data: ModItemList;
}) {
  return (
    <Page>
      <PageHeader
        title="mods"
        actions={
          <>
            <ModSearchDrawerContainer />
          </>
        }
      />
      <PageSection>
        <PaginatedDataTable data={data} columns={modListTableColumns} />
      </PageSection>
    </Page>
  );
}
