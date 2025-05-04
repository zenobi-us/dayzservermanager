import { cn } from ':lib/utils/cn';

import type { ComponentProps, PropsWithChildren } from 'react';

export function Page({
  children,
  className,
  ...props
}: PropsWithChildren<ComponentProps<'div'>>) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div
          className={cn('flex flex-col gap-4 py-4 md:gap-6 md:py-6', className)}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
