import { cn } from ':lib/utils';

import type { ComponentProps, PropsWithChildren } from 'react';

export function Container({
  children,
  className,
}: PropsWithChildren<ComponentProps<'div'>>) {
  return (
    <div
      className={cn('flex mx-auto w-full max-w-7xl sm:px-6 lg:px-8', className)}
    >
      {children}
    </div>
  );
}
