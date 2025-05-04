import { IconBrandSteam, IconLogout } from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { LoginDrawer } from './features/auth/LoginDrawer';
import { Button } from './ui/button';

import type { LoginFormData } from './features/auth/LoginFormData';

export function NavUser(
  props:
    | {
        user: {
          name: string;
          email: string;
          avatar: string;
        };
      }
    | {
        onLoginSubmit: (data: LoginFormData) => void;
      },
) {
  if (!('user' in props)) {
    return (
      <LoginDrawer onSubmit={props.onLoginSubmit}>
        <Button
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground justify-between cursor-pointer"
        >
          Login
          <IconBrandSteam />
        </Button>
      </LoginDrawer>
    );
  }

  const user = props.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 rounded-full grayscale cursor-pointer hover:grayscale-0 data-[state=open]:grayscale-0">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="rounded-full">CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 min-w-56 rounded-lg"
        side="top"
        align="center"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <IconLogout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
