
import { DataTable } from '@/components/data-table';
import { Page } from '@/components/page';
import { PageHeader } from '@/components/page-header';
import type { ModItemList } from '@dayzserver/sdk';

export function ModListDashboardPage({ mods = [] }: {
  mods: ModItemList
}) {
  return (
    <Page>
        <PageHeader title="mods" />
        <DataTable 
            data={[]}
        />
    </Page>
  )
}