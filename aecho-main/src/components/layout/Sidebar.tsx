import { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Briefcase,
  Settings,
  Clock,
  ClipboardCheck,
  FolderOpen,
  CreditCard,
  FileText,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  UserCircle2,
  ChevronDown,
  UserCog,
  FolderCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem =
  | {
      name: string;
      href: string;
      icon: any;
      children?: undefined;
    }
  | {
      name: string;
      href: string; // parent base path (e.g., "/command-centre")
      icon: any;
      children: { name: string; href: string; icon: any }[];
    };

const navigation: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Engagements", href: "/engagements", icon: Briefcase },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Accounts", href: "/command-centre", icon: Settings },
  {
    name: "Case Time",
    href: "#",
    icon: Clock,
    children: [
      { name: "Time Log", href: "/case-time/timelog", icon: Clock },
      { name: "Tickets", href: "/case-time/tickets", icon: FileText },
    ],
  },
  {
    name: "Review",
    href: "/iaurora-review",
    icon: ClipboardCheck,
    children: [
      { name: "Doc Xplorer", href: "/documents", icon: FolderOpen },
      { name: "AI Analysis", href: "/review/analysis", icon: ClipboardCheck },
    ],
  },
  { name: "Doc Central", href: "/doc-central", icon: FolderOpen },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Invoices", href: "/invoices", icon: FileText },
];

export function Sidebar() {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  // track expanded sections (for items with children)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // auto-expand the section that matches the current path
  useEffect(() => {
    const next: Record<string, boolean> = {};
    navigation.forEach((item) => {
      if ("children" in item && item.children) {
        const isActiveParent =
          location.pathname === item.href ||
          location.pathname.startsWith(item.href + "/") ||
          item.children.some((c) => location.pathname.startsWith(c.href));
        next[item.name] = isActiveParent;
      }
    });
    setExpanded((prev) => ({ ...prev, ...next }));
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleSidebar = () => setCollapsed((c) => !c);
  const toggleSection = (name: string) =>
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));

  const isActiveHref = useMemo(
    () => (href: string) => location.pathname === href,
    [location.pathname]
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          {!collapsed ? (
            <h1 className="text-xl font-semibold text-primary">Aurora Echo</h1>
          ) : (
            <span className="text-xl font-semibold text-primary">AE</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              // Simple item (no children)
              if (!("children" in item) || !item.children) {
                const isActive = isActiveHref(item.href);
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                  </li>
                );
              }

              // Parent with children
              const isParentActive =
                location.pathname === item.href ||
                location.pathname.startsWith(item.href + "/") ||
                item.children.some((c) => location.pathname.startsWith(c.href));

              return (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => toggleSection(item.name)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      isParentActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                    title={collapsed ? item.name : undefined}
                    aria-expanded={expanded[item.name] ?? false}
                    aria-controls={`section-${item.name}`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.name}</span>}
                    </span>
                    {!collapsed && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expanded[item.name] ? "rotate-180" : "rotate-0"
                        )}
                      />
                    )}
                  </button>

                  {/* Children */}
                  {(expanded[item.name] ?? false) && (
                    <ul
                      id={`section-${item.name}`}
                      className={cn(
                        "mt-1 space-y-1",
                        collapsed ? "px-1" : "pl-10 pr-2"
                      )}
                    >
                      {item.children.map((child) => {
                        const activeChild = location.pathname.startsWith(child.href);
                        return (
                          <li key={child.name}>
                             <NavLink
                              to={child.href}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                activeChild
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                  : "text-sidebar-foreground/90 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                              )}
                              title={collapsed ? child.name : undefined}
                            >
                              {/* child icon */}
                              {child.icon && <child.icon className="h-4 w-4 shrink-0" />}
                              {!collapsed && <span>{child.name}</span>}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Toggle Button */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="w-full justify-center"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
