import { Link } from '@tanstack/react-router';
import { Fragment } from 'react';

import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { UserContainer } from './UserContainer';
import { ThemeSelector } from './app/ThemeSelector';
import { Container } from './container';
import { Button } from './ui/button';

import type { IBreadcrumb } from '@/hooks/use-breadcrumbs';

export function SiteHeader() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <Container>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2  transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 py-2 lg:gap-2 ">
          <SiteHeaderBreadcrumbs items={breadcrumbs} />
        </div>
        <SiteNav />
      </header>
    </Container>
  );
}

export function SiteHeaderBreadcrumbs({
  items = [],
}: {
  items: IBreadcrumb[];
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.id}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={item.path}>{item.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {items.length - 1 > index && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function SiteNav() {
  return (
    <div className="absolute flex bottom-10 left-1/2 -translate-1/2 min-w-64 max-w-2/5 bg-black dark:bg-white rounded-full justify-between shadow-lg">
      <div className="flex pl-2.5 py-2 rounded-l-full items-center gap-2">
        <UserContainer />
        <ThemeSelector />
      </div>
      <div className="flex items-center justify-end px-2 gap-2 flex-grow rounded-r-full">
        <Button variant="ghost" inverted className="rounded-full" asChild>
          <Link to="/d/mods">Mods</Link>
        </Button>
        <Button variant="ghost" inverted className="rounded-full" asChild>
          <Link to="/d/servers">Servers</Link>
        </Button>
        <Button variant="ghost" inverted className="rounded-full" asChild>
          Settings
        </Button>
      </div>
    </div>
  );
}
