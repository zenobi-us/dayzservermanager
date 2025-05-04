import type { PropsWithChildren, ReactNode } from 'react';

export function ItemList({ children }: PropsWithChildren) {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {children}
    </ul>
  );
}
ItemList.Item = ItemListItem;

function ItemListItem({
  children,
  title,
  annotations,
  actions,
}: PropsWithChildren<{
  title: ReactNode;
  annotations?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}>) {
  return (
    <li className="flex items-center justify-between gap-x-6 py-5">
      <div className="min-w-0">
        <div className="flex items-start gap-x-3">
          <p className="text-sm/6 font-semibold text-gray-900">{title}</p>
          {annotations}
        </div>
        <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
          {children}
        </div>
      </div>
      <div className="flex flex-none items-center gap-x-4">{actions}</div>
    </li>
  );
}
