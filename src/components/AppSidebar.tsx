import { useEffect } from "react";
import {
  Home, Users, FileText, Wrench, ClipboardList, Scissors, Monitor,
  CalendarDays, ShoppingBag, DollarSign, BarChart3, MapPin,
  Calculator, Receipt, Package, Upload, Layers, Palette,
  Lock, TrendingUp, Warehouse, Bell, Settings, Kanban,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNotifications } from "@/hooks/use-notifications";
import { usePlano, PLAN_LABELS } from "@/hooks/use-plano";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Organized menu structure - 7 groups (from 27 items)
const menuGroups = [
  {
    label: "Principal",
    items: [
      { title: "Início", url: "/", icon: Home },
    ],
  },
  {
    label: "Vendas",
    items: [
      { title: "Orçamentos", url: "/orcamentos", icon: FileText },
      { title: "Clientes", url: "/clientes", icon: Users },
      { title: "CRM", url: "/crm", icon: Kanban, badgeKey: "crm" as const },
    ],
  },
  {
    label: "Operações",
    items: [
      { title: "Serviços", url: "/producao", icon: Wrench, badgeKey: "producao" as const },
      { title: "Agenda", url: "/agenda", icon: CalendarDays },
      { title: "Cálculo Esquadrias", url: "/calculo-esquadrias", icon: Calculator },
      { title: "Projeto Vidro", url: "/projeto-vidro", icon: Monitor },
      { title: "Plano de Corte", url: "/plano-corte", icon: Scissors },
    ],
  },
  {
    label: "Produção",
    items: [
      { title: "Relação Materiais", url: "/relacao-materiais", icon: ClipboardList },
      { title: "Tipologias", url: "/tipologias", icon: Layers },
    ],
  },
  {
    label: "Estoque",
    items: [
      { title: "Estoque", url: "/estoque", icon: Package, badgeKey: "estoque" as const },
      { title: "Gestão Estoque", url: "/gestao-estoque", icon: Warehouse },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { title: "Financeiro", url: "/financeiro", icon: DollarSign, badgeKey: "pagamento" as const },
      { title: "Nota Fiscal", url: "/nota-fiscal", icon: Receipt },
    ],
  },
  {
    label: "Configurações",
    items: [
      { title: "Configurações", url: "/configuracoes", icon: Settings },
      { title: "Marca", url: "/configuracao-marca", icon: Palette },
      { title: "Markup", url: "/configuracao-markup", icon: TrendingUp },
      { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
      { title: "Dashboard", url: "/dashboard-avancado", icon: TrendingUp },
      { title: "Mapa", url: "/mapa", icon: MapPin },
      { title: "Importar", url: "/importar-csv", icon: Upload },
      { title: "Produtos", url: "/produtos", icon: ShoppingBag },
      { title: "Catálogo MOF", url: "/catalogo-mof", icon: Package },
      { title: "Catálogo Vidros", url: "/catalogo-vidros", icon: Monitor },
    ],
  },
];

// Single items outside groups
const singleItems = [
  { title: "Notificações", url: "/notificacoes", icon: Bell },
];

// Portal routes (public, no auth required)
export const portalMenuItems = [
  { title: "Portal do Cliente", url: "/portal-cliente", icon: Users },
];

export function AppSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { badgeCounts, unreadCount } = useNotifications();
  const { hasAccess, getRequiredPlan } = usePlano();
  const { role } = useAuth();

  const isActive = (url: string) =>
    location.pathname === url ||
    (url !== "/" && location.pathname.startsWith(url));

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, location.pathname, setOpenMobile]);

  const renderMenuItem = (item: any, isCollapsed: boolean) => {
    const count = item.badgeKey ? badgeCounts[item.badgeKey] : 0;
    const locked = !hasAccess(item.url);
    const requiredPlan = locked ? getRequiredPlan(item.url) : null;

    const handleLockedClick = (e: React.MouseEvent) => {
      if (locked) {
        e.preventDefault();
        toast.error("Função bloqueada", { 
          description: `Disponível no plano ${requiredPlan ? PLAN_LABELS[requiredPlan] : "superior"}. Acesse Planos para fazer upgrade.` 
        });
        navigate("/configuracoes?tab=planos");
      }
    };

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={!locked && isActive(item.url)}>
          <NavLink
            to={locked ? "#" : item.url}
            end={item.url === "/"}
            className={cn(
              "hover:bg-sidebar-accent/50 transition-colors",
              locked && "opacity-50 cursor-not-allowed"
            )}
            activeClassName={locked ? "" : "bg-sidebar-accent text-sidebar-primary font-medium"}
            onClick={handleLockedClick}
          >
            <div className="relative">
              {locked ? (
                <Lock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <item.icon className="h-4 w-4" />
              )}
              {count > 0 && !locked && collapsed && (
                <span className="absolute -top-1.5 -right-1.5 h-3.5 min-w-3.5 px-0.5 rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </div>
            {!collapsed && (
              <>
                <span className="flex-1">{item.title}</span>
                {locked && (
                  <Lock className="h-3 w-3 text-muted-foreground ml-auto" />
                )}
                {!locked && count > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive/15 text-destructive text-[10px] font-bold px-1">
                    {count}
                  </span>
                )}
              </>
            )}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="sidebar-glass border-r-0">
      <div className="flex h-16 items-center gap-3 px-4 sidebar-header-glass">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[hsl(263,60%,70%)] shrink-0">
          <span className="text-white font-extrabold text-sm">AF</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-base font-extrabold text-sidebar-foreground tracking-tight">
              Alu<span className="text-primary">Flow</span>
            </span>
            <span className="text-[10px] text-sidebar-muted font-medium">
              Gestão Inteligente
            </span>
          </div>
        )}
      </div>

      <SidebarContent className="pt-2">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && (
              <SidebarGroupLabel className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted/60">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => renderMenuItem(item, collapsed))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Single items outside groups */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted/60">
              Extra
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {singleItems.map((item) => {
                const count = item.url === "/notificacoes" ? unreadCount : 0;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink
                        to={item.url}
                        className="hover:bg-sidebar-accent/50 transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <div className="relative">
                          <item.icon className="h-4 w-4" />
                          {count > 0 && collapsed && (
                            <span className="absolute -top-1.5 -right-1.5 h-3.5 min-w-3.5 px-0.5 rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground flex items-center justify-center">
                              {count > 9 ? "9+" : count}
                            </span>
                          )}
                        </div>
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {count > 0 && (
                              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive/15 text-destructive text-[10px] font-bold px-1">
                                {count}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
