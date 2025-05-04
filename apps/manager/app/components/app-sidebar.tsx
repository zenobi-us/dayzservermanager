import {
  IconChartBar,
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
} from '@tabler/icons-react';

import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { UserContainer } from './UserContainer';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/d',
      icon: IconDashboard,
    },
    {
      title: 'Servers',
      url: '/d/servers',
      icon: IconListDetails,
    },
    {
      title: 'Mods',
      url: '/d/mods',
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
      </SidebarContent>
      <SidebarFooter>
        <UserContainer />
      </SidebarFooter>
    </Sidebar>
  );
}
