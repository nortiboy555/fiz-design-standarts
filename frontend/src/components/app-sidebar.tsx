"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenTool,
  ImageIcon,
  ClipboardCheck,
  FlaskConical,
  Users,
  Monitor,
  Target,
  Palette,
  FileText,
  ShieldAlert,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

const toolsNav: { title: string; href: string; icon: LucideIcon }[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Copy Lab", href: "/copylab", icon: PenTool },
  { title: "Creative Preview", href: "/preview", icon: ImageIcon },
  { title: "Pre-flight Check", href: "/checklist", icon: ClipboardCheck },
  { title: "Test Planner", href: "/testplanner", icon: FlaskConical },
];

const referenceNav: { title: string; href: string; icon: LucideIcon }[] = [
  { title: "ICP Cards", href: "/icp", icon: Users },
  { title: "Format Guide", href: "/formats", icon: Monitor },
  { title: "Competitors", href: "/competitors", icon: Target },
  { title: "Visual Styles", href: "/visuals", icon: Palette },
];

const copyLibraryNav: { title: string; href: string; icon: LucideIcon }[] = [
  { title: "Copy Formulas", href: "/headlines", icon: FileText },
  { title: "Compliance", href: "/compliance", icon: ShieldAlert },
];

export function AppSidebar() {
  const pathname = usePathname();

  const renderNav = (items: { title: string; href: string; icon: LucideIcon }[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton asChild isActive={pathname === item.href}>
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            FIZ Creative Hub
          </h1>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            Beta
          </Badge>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>{renderNav(toolsNav)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Reference</SidebarGroupLabel>
          <SidebarGroupContent>{renderNav(referenceNav)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Copy Library</SidebarGroupLabel>
          <SidebarGroupContent>{renderNav(copyLibraryNav)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
