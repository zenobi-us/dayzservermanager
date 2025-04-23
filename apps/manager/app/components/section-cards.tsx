import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ElementType, PropsWithChildren, ReactNode } from 'react';
import { cn } from '../lib/utils/cn';

export function SectionCards({ children }: PropsWithChildren) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {children}
    </div>
  );
}
SectionCards.Item = SectionCardsItem;
SectionCards.Badge = SectionCardBadge;
SectionCards.TextPrimary = SectionCardTextPrimary;
SectionCards.TextSecondary = SectionCardTextSecondary;

function SectionCardsItem({
  title,
  description,
  actions,
  footer,
  className,
  onClick,
  ...props
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Card
      className={cn('@container/card', className)}
      onClick={onClick}
      {...props}
    >
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        {title && (
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {title}
          </CardTitle>
        )}
        {actions}
      </CardHeader>
      {footer && (
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

function SectionCardTextPrimary({
  children,
  icon: Icon,
}: {
  children: ReactNode;
  icon: ElementType;
}) {
  return (
    <div className="line-clamp-1 flex gap-2 font-medium">
      {children} {Icon && <Icon className="size-4" />}
    </div>
  );
}
function SectionCardTextSecondary({ children }: { children: ReactNode }) {
  return <div className="text-muted-foreground">{children}</div>;
}

function SectionCardBadge({
  label,
  icon,
}: {
  label: string;
  icon?: ReactNode;
}) {
  return (
    <CardAction className="cursor-pointer">
      <Badge variant="outline">
        {icon}
        {label}
      </Badge>
    </CardAction>
  );
}
