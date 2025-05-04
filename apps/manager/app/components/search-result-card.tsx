import { cn } from ":lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from ":components/ui/card"
import { ComponentProps, PropsWithChildren, ReactNode } from "react"


export function SearchResultCard({ id, title, description, author, image, className, children, footer, ...props }: PropsWithChildren<{
    title: string;
    description: string;
    author: string;
    image: string
    footer: ReactNode
} & ComponentProps<'div'>>) {
    return (
        <Card className={cn(className)} {...props}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{author}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {children}
            </CardContent>
            <CardFooter>
                {footer}
            </CardFooter>
        </Card>
    )
}

// export function CardDemo({ className, ...props }: CardProps) {
//     return (
//         <Card className={cn("w-[380px]", className)} {...props}>
//             <CardHeader>
//                 <CardTitle>Notifications</CardTitle>
//                 <CardDescription>You have 3 unread messages.</CardDescription>
//             </CardHeader>
//             <CardContent className="grid gap-4">
//                 <div className=" flex items-center space-x-4 rounded-md border p-4">
//                     <BellRing />
//                     <div className="flex-1 space-y-1">
//                         <p className="text-sm font-medium leading-none">
//                             Push Notifications
//                         </p>
//                         <p className="text-sm text-muted-foreground">
//                             Send notifications to device.
//                         </p>
//                     </div>
//                     <Switch />
//                 </div>
//                 <div>
//                     {notifications.map((notification, index) => (
//                         <div
//                             key={index}
//                             className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
//                         >
//                             <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
//                             <div className="space-y-1">
//                                 <p className="text-sm font-medium leading-none">
//                                     {notification.title}
//                                 </p>
//                                 <p className="text-sm text-muted-foreground">
//                                     {notification.description}
//                                 </p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </CardContent>
//             <CardFooter>
//                 <Button className="w-full">
//                     <Check /> Mark all as read
//                 </Button>
//             </CardFooter>
//         </Card>
//     )
// }
