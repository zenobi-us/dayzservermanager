import { Page } from '@/components/page';
import { PageHeader } from '@/components/page-header';
import { PageSection } from '@/components/page-section';

import { ModListDataTable } from './ModListDataTable';
import { ModSearchDrawerContainer } from './ModSearchDrawer';

import type { ComponentProps } from 'react';

export function ModListDashboardPage({
  data = [],
}: ComponentProps<typeof ModListDataTable>) {
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
        <ModListDataTable data={data} />
      </PageSection>
    </Page>
  );
}
