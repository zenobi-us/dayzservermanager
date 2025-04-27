import { zodResolver } from '@hookform/resolvers/zod';
import {
  IconBrandSteam,
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from '@tabler/icons-react';
import { createContext, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { Button } from './ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from './ui/drawer';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';

import type { PropsWithChildren } from 'react';

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
  const { isMobile } = useSidebar();

  if (!('user' in props)) {
    return (
      <LoginDrawer onSubmit={props.onLoginSubmit}>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground justify-between cursor-pointer"
        >
          Login
          <IconBrandSteam />
        </SidebarMenuButton>
      </LoginDrawer>
    );
  }

  const user = props.user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
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
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function LoginDrawer({
  onSubmit,
  children,
}: PropsWithChildren<{
  onSubmit: (data: LoginFormData) => void;
}>) {
  return (
    <Drawer direction="top">
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent className={cn('w-2xl m-auto', 'border-t-0 shadow-lg')}>
        <div className="p-4 bg-white rounded-t-[10px] flex-1">
          <LoginFormProvider onSubmit={onSubmit}>
            <DrawerHeader>Login</DrawerHeader>
            <div className="flex flex-grow">
              <LoginFormFields />
            </div>
            <DrawerFooter>
              <Button type="submit">Login</Button>
            </DrawerFooter>
          </LoginFormProvider>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const LoginFormSchema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required'),
});
type LoginForm = typeof LoginFormSchema;
type LoginFormData = z.infer<LoginForm>;

function useLoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  return form;
}

const LoginFormContext = createContext<null | ReturnType<typeof useLoginForm>>(
  null,
);
const useLoginFormContext = () => {
  const context = useContext(LoginFormContext);
  if (!context) {
    throw new Error('LoginFormContext must be provided');
  }
  return context;
};

function LoginFormProvider({
  onSubmit,
  children,
}: PropsWithChildren<{ onSubmit: (data: LoginFormData) => void }>) {
  const form = useLoginForm();

  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <LoginFormContext.Provider value={form}>
          {children}
        </LoginFormContext.Provider>
      </form>
    </Form>
  );
}

function LoginFormFields() {
  const form = useLoginFormContext();
  return (
    <div className="flex flex-col w-full gap-4 px-4">
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input
                className="flex"
                type="text"
                placeholder="Username"
                {...field}
              />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                className="flex"
                type="password"
                placeholder="password"
                {...field}
              />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
