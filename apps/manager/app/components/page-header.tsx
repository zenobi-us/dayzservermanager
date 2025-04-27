import type { ReactNode } from 'react';

export function PageHeader({
  title,
  actions,
}: {
  title: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col lg:px-6 gap-4 px-4">
      <div className="flex gap-4 space-between">
        <h1 className="text-4xl">{title}</h1>
        {actions && <div className="ml-auto">{actions}</div>}
      </div>
      <hr />
    </div>
  );
}
