import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CandlestickChart,
  Repeat,
  ScrollText,
  TrendingUp,
  Bell,
  Search,
} from "lucide-react";
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const nav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Markets", url: "/markets", icon: CandlestickChart },
  { title: "SIP & Automations", url: "/sip-automations", icon: Repeat },
  { title: "Ledger", url: "/ledger", icon: ScrollText },
] as const;

function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">ZeroDelta</span>
            <span className="text-[11px] text-sidebar-foreground/60">Robo-Advisor</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-2 py-3 text-[11px] leading-relaxed text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
          <div className="font-medium text-sidebar-foreground/80">ZeroDelta v1.0</div>
          <div>© 2026 — All markets, one platform.</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/40">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background px-4 md:px-8">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-foreground md:text-lg">{title}</h1>
            </div>
            <div className="ml-auto flex items-center gap-2 md:gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search ticker, e.g. BTC, AAPL"
                  className="h-9 w-72 pl-9"
                />
              </div>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">ZD</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
          <footer className="border-t border-border bg-background px-4 py-4 text-xs text-muted-foreground md:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-1 md:flex-row md:items-center">
              <span>© 2026 ZeroDelta. Multi-asset robo-advisor for the modern investor.</span>
              <span>Markets data is simulated for demo purposes.</span>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
