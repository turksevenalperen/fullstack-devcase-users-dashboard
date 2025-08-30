"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  ArchiveIcon,
  ChartLineIcon,
  ChevronDownIcon,
  Grid2x2Icon,
  Home,
  PlusCircleIcon,
  
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface MenuItem {
  label?: string;
  action?: React.ReactNode;
  items: {
    label: string;
    icon: React.ElementType;
    hasSubMenu?: boolean;
    href?: string;
    badge?: string;
    subMenu?: {
      label: string;
      icon: React.ElementType;
      href: string;
    }[];
  }[];
}

export default function NavMenu() {
  const router = useRouter();
  const navMain: MenuItem[] = [
    {
      label: "MAIN MENU",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: Home,
        },
        {
          label: "Users",
          hasSubMenu: true,
          icon: ArchiveIcon,
          href: "/users",
          subMenu: [
            {
              label: "All Users",
              href: "/users",
              icon: Home,
            },
            {
              label: "Add New User",
              href: "/users/new",
              icon: PlusCircleIcon,
            },
          ],
        },
        {
          label: "Categories",
          href: "/categories",
          icon: Grid2x2Icon,
        },
      ],
    },
    {
      label: "ANALYTICS",
      items: [
        {
          label: "Sales",
          href: "/analytics/sales",
          icon: ChartLineIcon,
          badge: "49",
        },
      ],
    },
  ];

  return navMain.map((item) => (
    <SidebarGroup key={item.label}>
      <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
      {item.action && (
        <SidebarGroupAction asChild>{item.action}</SidebarGroupAction>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {item.items.map((item, index) => (
            <React.Fragment key={index}>
              {item.hasSubMenu ? (
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <item.icon />
                        <p className="flex-1">{item.label}</p>
                        <ChevronDownIcon className=" size-4" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subMenu?.map((subItem, subIndex) => (
                          <SidebarMenuSubItem key={subIndex}>
                            <Button
                              className="w-full shadow-none justify-start bg-transparent text-muted-foreground hover:bg-transparent hover:text-accent-foreground [&>svg]:text-muted-foreground hover:[&>svg]:text-accent-foreground"
                              size="sidebar-submenu"
                              asChild
                            >
                              {subItem.label === 'Add New User' ? (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    router.push('/dashboard?openNewUser=1');
                                  }}
                                  className="w-full text-left"
                                >
                                  <subItem.icon />
                                  <p className="flex-1">{subItem.label}</p>
                                </button>
                              ) : (
                                <Link href={subItem.href}>
                                  <subItem.icon />
                                  <p className="flex-1">{subItem.label}</p>
                                </Link>
                              )}
                            </Button>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    {item.label === "Categories" || item.label === "Sales" ? (
                      <div className="flex items-center w-full">
                        <item.icon />
                        <p className="flex-1">{item.label}</p>
                        {item.badge && (
                          <Badge
                            variant="accent"
                            className="size-6 rounded-full font-semibold"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <Link href={item.href!}>
                        <item.icon />
                        <p className="flex-1">{item.label}</p>
                        {item.badge && (
                          <Badge
                            variant="accent"
                            className="size-6 rounded-full font-semibold"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </React.Fragment>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}
