import {
  Home, Users, FileText, Wrench, ClipboardList, Scissors, Monitor,
  CalendarDays, ShoppingBag, DollarSign, BarChart3, MapPin,
  UserCog, UserCheck, Calculator, Receipt, Package,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Início", url: "/", icon: Home },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Orçamentos", url: "/orcamentos", icon: FileText },
  { title: "Cálculo Esquadrias", url: "/calculo-esquadrias", icon: Calculator },
  { title: "Serviços", url: "/producao", icon: Wrench },
  { title: "Relação materiais", url: "/relacao-materiais", icon: ClipboardList },
  { title: "Plano de corte", url: "/plano-corte", icon: Scissors },
  { title: "Projeto vidro", url: "/projeto-vidro", icon: Monitor },
  { title: "Estoque", url: "/estoque", icon: Package },
  { title: "Agenda", url: "/agenda", icon: CalendarDays },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign },
  { title: "Produtos", url: "/produtos", icon: ShoppingBag },
  { title: "Preço dos itens", url: "/preco-itens", icon: DollarSign },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Mapa", url: "/mapa", icon: MapPin },
  { title: "Administradores", url: "/administradores", icon: UserCog },
  { title: "Funcionários", url: "/funcionarios", icon: UserCheck },
  { title: "Nota Fiscal", url: "/nota-fiscal", icon: Receipt },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="sidebar-glass border-r-0">
      <div className="flex h-16 items-center gap-3 px-4 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary shrink-0">
          <span className="text-sidebar-primary-foreground font-extrabold text-sm">AP</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-base font-extrabold text-sidebar-foreground tracking-tight">
              AlumPRO
            </span>
            <span className="text-[10px] text-sidebar-muted font-medium">
              Gestão de Esquadrias
            </span>
          </div>
        )}
      </div>
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  (item.url !== "/" && location.pathname.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="hover:bg-sidebar-accent/50 transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
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
