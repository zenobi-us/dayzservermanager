
import {
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { ReactNode } from "react"

type Option<T extends string> = {
    value: T,
    label: ReactNode
}

export function TabSelector<T extends string>({
    label = 'View',
    description = "Select a view",
    items,
}: {
    label: string;
    description: string;
    items: Option<T>[]

}) {
    return (
        <>
            <Label htmlFor="view-selector" className="sr-only">
                {label}
            </Label>
            <Select defaultValue="outline">
                <SelectTrigger
                    className="flex w-fit @4xl/main:hidden"
                    size="sm"
                    id="view-selector"
                >
                    <SelectValue placeholder={description} />
                </SelectTrigger>
                <SelectContent>
                    {items.map(item => (
                        <SelectItem value={item.value}>{item.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                {items.map(item => (
                    <TabsTrigger value={item.value}>{item.label}</TabsTrigger>
                ))}
            </TabsList>
        </>
    )
}