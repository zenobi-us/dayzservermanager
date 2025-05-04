import { cn } from ':lib/utils/cn';

import type { PropsWithChildren, ComponentProps } from 'react';

export function PageSection({
  children,
  className,
  ...props
}: PropsWithChildren<ComponentProps<'div'>>) {
  return (
    <div className={cn('flex-col gap-4', className)} {...props}>
      {children}
    </div>
  );
}
