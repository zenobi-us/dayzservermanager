
export function PageHeader({ title }: { title:string }) {
  return (
    <div className="flex flex-col lg:px-6 gap-4 px-4">
      <h1 className="text-4xl">{title}</h1>
      <hr/>
    </div>
  )
}