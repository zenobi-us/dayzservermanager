import {
  IconChartBar,
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useStore, Effect } from '@tanstack/react-store';
import { useEffect } from 'react';

import { AuthStore } from '@/core/store/AuthStore';

import * as api from '../core/api';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { isErrorResponse } from '@/types/response';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: IconDashboard,
    },
    {
      title: 'Servers',
      url: '/servers',
      icon: IconListDetails,
    },
    {
      title: 'Mods',
      url: '/mods',
      icon: IconChartBar,
    },
  ],
  navClouds: [],
  navSecondary: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">
                  DayZ Server Manager.
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <UserContainer />
      </SidebarFooter>
    </Sidebar>
  );
}

function UserContainer() {
  const getAuthenticatedUser = useServerFn(api.steam.getAuthenticatedUser);
  const loginFn = useServerFn(api.steam.login);
  const loginMutation = useMutation({
    mutationFn: loginFn,
    onSuccess(data) {
      if (isErrorResponse(data)) {
        throw new Error(data.errorCode);
      }
      AuthStore.setState((state) => ({
        ...state,
        username: data.data.username,
        isAuthenticated: true,
      }));
    },
  });

  const username = useStore(
    AuthStore,
    (state) => state.isAuthenticated && state.username,
  );

  useEffect(() => {
    getAuthenticatedUser()
      .then((data) => {
        if (isErrorResponse(data)) {
          return;
        }
        AuthStore.setState((state) => ({
          ...state,
          isAuthenticated: !!data.data.username,
          username: data.data.username,
        }));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const effect = new Effect({
      fn: () => {
        console.log('The AuthStore is now:', AuthStore.state);
      },
      // Array of `Store`s or `Derived`s
      deps: [AuthStore],
      // Should effect run immediately, default is false
      eager: true,
    });

    return () => {
      effect.mount();
    };
  }, []);

  if (!username) {
    return (
      <NavUser
        onLoginSubmit={(data) => {
          console.log('login', data);
          loginMutation.mutate({ data });
        }}
      />
    );
  }

  return (
    <NavUser
      user={{
        avatar:
          'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/39.jpg',
        name: username,
        email: '',
      }}
    />
  );
}
