import { useEffect } from "react";
import {
  Home, Users, FileText, Wrench, ClipboardList, Scissors, Monitor,
  CalendarDays, ShoppingBag, DollarSign, BarChart3, MapPin,
  UserCog, UserCheck, Calculator, Receipt, Package, Upload, Kanban,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Início", url: "/", icon: Home },
  
  { title: "CRM", url: "/crm", icon: Kanban },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Orçamentos", url: "/orcamentos", icon: FileText },
  { title: "Serviços", url: "/producao", icon: Wrench },
  { title: "Cálculo Esquadrias", url: "/calculo-esquadrias", icon: Calculator },
  { title: "Relação materiais", url: "/relacao-materiais", icon: ClipboardList },
  { title: "Plano de corte", url: "/plano-corte", icon: Scissors },
  { title: "Projeto vidro", url: "/projeto-vidro", icon: Monitor },
  { title: "Agenda", url: "/agenda", icon: CalendarDays },
  { title: "Produtos", url: "/produtos", icon: ShoppingBag },
  { title: "Preço dos itens", url: "/preco-itens", icon: DollarSign },
  { title: "Estoque", url: "/estoque", icon: Package },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign },
  { title: "Nota Fiscal", url: "/nota-fiscal", icon: Receipt },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Mapa", url: "/mapa", icon: MapPin },
  { title: "Administradores", url: "/administradores", icon: UserCog },
  { title: "Funcionários", url: "/funcionarios", icon: UserCheck },
  { title: "Importar Planilha", url: "/importar-csv", icon: Upload },
];

export function AppSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

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
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
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
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
