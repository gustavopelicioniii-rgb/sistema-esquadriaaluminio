import { useEffect } from "react";
import {
  Home, Users, FileText, Wrench, ClipboardList, Scissors, Monitor,
  CalendarDays, ShoppingBag, DollarSign, BarChart3, MapPin,
  Calculator, Receipt, Package, Upload, Kanban, Bell, Settings, Layers, Palette,
  Lock, Crown, TrendingUp, Warehouse, UserCircle,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNotifications } from "@/hooks/use-notifications";
import { usePlano, PLAN_LABELS } from "@/hooks/use-plano";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
const menuItems = [
  { title: "Início", url: "/", icon: Home },
  { title: "CRM", url: "/crm", icon: Kanban, badgeKey: "crm" as const },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Orçamentos", url: "/orcamentos", icon: FileText },
  { title: "Serviços", url: "/producao", icon: Wrench, badgeKey: "producao" as const },
  { title: "Cálculo Esquadrias", url: "/calculo-esquadrias", icon: Calculator },
  { title: "Relação materiais", url: "/relacao-materiais", icon: ClipboardList },
  { title: "Plano de corte", url: "/plano-corte", icon: Scissors },
  { title: "Projeto vidro", url: "/projeto-vidro", icon: Monitor },
  { title: "Agenda", url: "/agenda", icon: CalendarDays },
  { title: "Produtos", url: "/produtos", icon: ShoppingBag },
  
  { title: "Estoque", url: "/estoque", icon: Package, badgeKey: "estoque" as const },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign, badgeKey: "pagamento" as const },
  { title: "Nota Fiscal", url: "/nota-fiscal", icon: Receipt },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Mapa", url: "/mapa", icon: MapPin },
  { title: "Importar Planilha", url: "/importar-csv", icon: Upload },
  { title: "Tipologias", url: "/tipologias", icon: Layers },
  { title: "Catálogo MOF", url: "/catalogo-mof", icon: Package },
  { title: "Catálogo Vidros", url: "/catalogo-vidros", icon: Monitor },
  
  { title: "Configurações", url: "/configuracoes", icon: Settings },
  { title: "Configuração de Marca", url: "/configuracao-marca", icon: Palette },
  { title: "Configuração de Markup", url: "/configuracao-markup", icon: TrendingUp },
  { title: "Gestão de Estoque", url: "/gestao-estoque", icon: Warehouse },
];

// Portal routes (public, no auth required)
export const portalMenuItems = [
  { title: "Portal do Cliente", url: "/portal-cliente", icon: UserCircle },
];

export function AppSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { badgeCounts, unreadCount } = useNotifications();
  const { hasAccess, getRequiredPlan } = usePlano();
  const { role } = useAuth();

  const visibleItems = menuItems;

  const isActive = (url: string) =>
    location.pathname === url ||
    (url !== "/" && location.pathname.startsWith(url));

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, location.pathname, setOpenMobile]);

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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => {
                const count = item.badgeKey ? badgeCounts[item.badgeKey] : 0;
                const locked = !hasAccess(item.url);
                const requiredPlan = locked ? getRequiredPlan(item.url) : null;

                const handleLockedClick = (e: React.MouseEvent) => {
                  if (locked) {
                    e.preventDefault();
                    toast.error("Função bloqueada", { description: `Disponível no plano ${requiredPlan ? PLAN_LABELS[requiredPlan] : "superior"}. Acesse Planos para fazer upgrade.` });
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
              })}

              {/* Notificações link */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/notificacoes")}>
                  <NavLink
                    to="/notificacoes"
                    className="hover:bg-sidebar-accent/50 transition-colors"
                    activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                  >
                    <div className="relative">
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && collapsed && (
                        <span className="absolute -top-1.5 -right-1.5 h-3.5 min-w-3.5 px-0.5 rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </div>
                    {!collapsed && (
                      <>
                        <span className="flex-1">Notificações</span>
                        {unreadCount > 0 && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive/15 text-destructive text-[10px] font-bold px-1">
                            {unreadCount}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
