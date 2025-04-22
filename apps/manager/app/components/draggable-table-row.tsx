import { UniqueIdentifier } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { TableCell, TableRow } from "./ui/table"
import { CSS } from "@dnd-kit/utilities"
import { flexRender, Row } from "@tanstack/react-table"

export function DraggableRow<T>({ row, getRowId }: { row: Row<T>, getRowId: (row:T) => UniqueIdentifier }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: getRowId(row.original),
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}