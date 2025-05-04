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
        'flex-grow',
        'grid gap-4',
        'grid-rows-[200px_minmax(200px,1fr)_100px]',
        'grid-cols-2',
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
