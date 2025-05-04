import React, { type ReactNode, type ComponentProps, Fragment } from 'react';

import { cn } from ':lib/utils';

export function SeparatedBy({
  children,
  by = <SeparatedBy.Separator />,
  className,
  ...props
}: { children: ReactNode; by?: ReactNode } & ComponentProps<'div'>) {
  const total = React.Children.count(children);
  return (
    <div className={cn('flex items-center gap-x-2', className)} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!child) {
          return null;
        }

        return (
          <Fragment>
            {child}
            {(total > 1 && index < total - 1 && by) || null}
          </Fragment>
        );
      })}
    </div>
  );
}
SeparatedBy.Separator = () => (
  <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
    <circle r={1} cx={1} cy={1} />
  </svg>
);
