import type { PropsWithChildren, ReactNode } from 'react';

export function PageHeader({
  title,
  actions,
  children,
}: PropsWithChildren<{
  title: string;
  actions?: ReactNode;
}>) {
  return (
    <div className="flex flex-col lg:px-6 gap-4 px-4">
      <div className="flex gap-4 justify-start items-center">
        <h1 className="text-4xl">{title}</h1>
        {actions}
      </div>
      {children}
      <hr />
    </div>
  );
}
