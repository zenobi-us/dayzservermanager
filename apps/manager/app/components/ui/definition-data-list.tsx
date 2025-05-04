import type { PropsWithChildren, ReactNode } from 'react';

export function DefinitionData<
  T extends { id: string; label: string; value: any },
>({
  data,
  itemValueRenderer,
  itemLabelRenderer,
}: PropsWithChildren<{
  data: T[];
  itemValueRenderer: (item: T) => ReactNode;
  itemLabelRenderer: (item: T) => ReactNode;
}>) {
  return (
    <DefinitionDataList>
      {data.map((item) => (
        <DefinitionDataItem label={itemLabelRenderer(item)}>
          {itemValueRenderer(item)}
        </DefinitionDataItem>
      ))}
    </DefinitionDataList>
  );
}

DefinitionData.List = DefinitionDataList;
DefinitionData.Item = DefinitionDataItem;

export function DefinitionDataList({ children }: PropsWithChildren) {
  return <dl>{children}</dl>;
}

export function DefinitionDataItem({
  label,
  children,
}: PropsWithChildren<{
  label: ReactNode;
}>) {
  return (
    <>
      <dt className="text-primary font-bold">{label}</dt>
      <dd className="text-secondary">{children}</dd>
    </>
  );
}
