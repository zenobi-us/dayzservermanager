import type { ModItemList } from '@dayzserver/sdk';

import { Page } from '@/components/page';
import { PageHeader } from '@/components/page-header';
import { PageSection } from '@/components/page-section';
import { ModListDataTable } from './ModListDataTable';
import { createOpenState } from '@/hooks/use-open-state';
import { ModSearchDrawerContainer } from './ModSearchDrawer';


const openState = createOpenState({
  addModDrawer: false,
  modDetailDrawer: false
})

export function ModListDashboardPage({ mods = [] }: {
  mods: ModItemList
}) {

  return (
    <Page>
      <PageHeader title="mods"
        actions={
          <ModSearchDrawerContainer />
        }
      />
      <PageSection>
        <ModListDataTable
          data={mods}
        />
      </PageSection>
    </Page >
  )
}

