import { cn } from ':lib/utils/cn';

import { PageSection } from './page-section';

import type { PropsWithChildren, ComponentProps } from 'react';

export function PageSectionGrid({
  children,
  className,
  ...props
}: PropsWithChildren<ComponentProps<'div'>>) {
  return (
    <PageSection
      className={cn(
        'grid gap-4 px-4 lg:px-6',
        'grid-rows-[200px_minmax(200px,1fr)_100px]',
        '@xl/main:grid-cols-2',
        '@5xl/main:grid-cols-4',
        className,
      )}
      {...props}
    >
      {children}
    </PageSection>
  );
}
