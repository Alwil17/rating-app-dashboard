import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ModeToggle } from "@/components/layout/mode-toggle";
import UserDropdown from "@/components/layout/user.dropdown";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { routes } from "@/config/routes";
import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { Separator } from "@radix-ui/react-separator";
import { PiGauge } from "react-icons/pi";

export default function AdminHeader() {
  const { pageTitle } = useBreadcrumb();
  
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="-ms-4" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={routes.admin.home}>
                <PiGauge size={22} aria-hidden="true" />
                <span className="sr-only">Dashboard</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex gap-3 ml-auto">
        <ModeToggle />
        <LanguageSwitcher />
        <UserDropdown />
      </div>
    </header>
  );
}