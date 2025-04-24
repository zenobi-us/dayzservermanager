import { cn } from "@/lib/utils/cn";
import type { PropsWithChildren, ComponentProps } from "react";
import { PageSection } from "./page-section";


export function PageSectionGrid({ children, className, ...props }: PropsWithChildren<ComponentProps<'div'>>) {
    return (
        <PageSection className={cn("grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4", className)} {...props}>
            {children}
        </PageSection>
    );
}
