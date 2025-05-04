import { IconChevronCompactRight } from '@tabler/icons-react';

import { Badge } from ':components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from ':components/ui/card';

import { cn } from '../lib/utils/cn';

import { PageSectionGrid } from './page-section-grid';

import type { ElementType, PropsWithChildren, ReactNode } from 'react';

export function SectionCards({ children }: PropsWithChildren) {
  return (
    <PageSectionGrid className="*:data-[slot=card]:border-2 *:data-[slot=card]:shadow-none">
      {children}
    </PageSectionGrid>
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
  description?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Card
      className={cn(
        '@container/card',
        !!onClick && 'cursor-pointer hover:border-gray-400',
        className,
      )}
      onClick={onClick}
      {...props}
    >
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        {title && (
          <CardTitle className="flex gap-2 items-center text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {title}
            {!!onClick && (
              <IconChevronCompactRight className="@container/card:hover:translate-x-1 transition-transform" />
            )}
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
