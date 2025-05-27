"use client"

import Image from "next/image"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { mainNavigation } from "@/config/navigation-items"
import { Link } from "lucide-react"
import { usePathname } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    const isActive = (url: string) => {
      if (url === "#") return false;
      return pathname === url;
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="bg-sidebar-accent text-sidebar-accent-foreground gap-3 [&>svg]:size-auto">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden bg-sidebar-primary text-sidebar-primary-foreground">
                                <Image
                                    src="/logo.png"
                                    width={36}
                                    height={36}
                                    alt="Rate Master Logo"
                                />
                            </div>
                            <div className="grid flex-1 text-left text-base leading-tight">
                                <span className="truncate font-medium">
                                    Rate Master
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {mainNavigation.map((section) => (
                    <SidebarGroup key={section.title}>
                        <SidebarGroupLabel className="uppercase text-muted-foreground/60">{section.title}</SidebarGroupLabel>
                        <SidebarGroupContent className="px-2">
                            <SidebarMenu>
                                {section.items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                                                isActive={isActive(item.url)}
                                            >
                                                <Link href={item.url}>
                                                    {item.icon && (
                                                        <item.icon
                                                            className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                                                            size={22}
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
