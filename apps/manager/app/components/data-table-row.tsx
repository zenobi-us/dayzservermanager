import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { flexRender } from '@tanstack/react-table';

import { TableCell, TableRow } from './ui/table';

import type { UniqueIdentifier } from '@dnd-kit/core';
import type { Row } from '@tanstack/react-table';
import type { ComponentProps } from 'react';

export function DataTableRow<T>({
  row,
  getRowId,
  ...props
}: { row: Row<T>; getRowId: (row: T) => UniqueIdentifier } & ComponentProps<
  typeof TableRow
>) {
  return (
    <TableRow
      data-id={getRowId(row.original)}
      data-state={row.getIsSelected() && 'selected'}
      className="relative z-0"
      {...props}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DraggableDataTableRow<T>({
  row,
  getRowId,
}: {
  row: Row<T>;
  getRowId: (row: T) => UniqueIdentifier;
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: getRowId(row.original),
  });

  return (
    <DataTableRow
      row={row}
      getRowId={getRowId}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    />
  );
}
