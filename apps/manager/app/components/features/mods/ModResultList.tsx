import { PageSectionGrid } from '../../page-section-grid';

import { ModResultItemDrawer } from './ModResultItemDrawer';

import type { SteamWorkshopSearchResults } from '@dayzserver/sdk/schema';

export function ModSearchResultList({
  publishedfiledetails,
  //   total,
}: {
  publishedfiledetails: SteamWorkshopSearchResults['response']['publishedfiledetails'];
  total: SteamWorkshopSearchResults['response']['total'];
}) {
  return (
    <PageSectionGrid>
      {publishedfiledetails.map((item) => (
        <ModResultItemDrawer item={item} />
      ))}
    </PageSectionGrid>
  );
}
