import { useState } from "react";
import { Bell, Search, User, Sun, Moon, Package, DollarSign, Wrench, CheckCheck, Loader2, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AppSidebar } from "@/components/AppSidebar";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications, type AppNotification } from "@/hooks/use-notifications";
import { useGlobalSearch } from "@/hooks/use-global-search";
import { ScrollArea } from "@/components/ui/scroll-area";

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/crm": "CRM",
  "/clientes": "Clientes",
  "/orcamentos": "Orçamentos",
  "/orcamentos/novo": "Novo Orçamento",
  "/producao": "Produção",
  "/plano-corte": "Plano de Corte",
  "/projeto-vidro": "Projeto Vidro",
  "/relacao-materiais": "Relação de Materiais",
  "/estoque": "Estoque",
  "/financeiro": "Financeiro",
  "/agenda": "Agenda",
  "/produtos": "Produtos",
  "/preco-itens": "Preço de Itens",
  "/relatorios": "Relatórios",
  "/mapa": "Mapa",
  "/nota-fiscal": "Nota Fiscal",
  "/calculo-esquadrias": "Cálculo Esquadrias",
  "/importar-csv": "Importar CSV",
  "/administradores": "Administradores",
  "/funcionarios": "Funcionários",
  "/configuracoes": "Configurações",
};

const typeConfig: Record<AppNotification["type"], { icon: typeof Package; color: string; route: string }> = {
  estoque: { icon: Package, color: "text-warning", route: "/estoque" },
  pagamento: { icon: DollarSign, color: "text-destructive", route: "/financeiro" },
  producao: { icon: Wrench, color: "text-primary", route: "/producao" },
};

const typeBadgeColors: Record<string, string> = {
  Cliente: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Orçamento: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Pedido: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Produto: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Estoque: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};

export function Topbar() {
  const { theme, toggle } = useTheme();
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { results, loading: searchLoading } = useGlobalSearch(search);
  const isMobile = useIsMobile();

  const pageTitle = routeTitles[location.pathname] || "";
  const initials = user?.email?.slice(0, 2).toUpperCase() || "??";
  const roleLabel = role === "admin" ? "Admin" : "Funcionário";

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handleNotificationClick = (n: AppNotification) => {
    markAsRead(n.id);
    const config = typeConfig[n.type];
    navigate(config.route);
  };

  return (
    <header className="topbar-glass sticky top-0 z-30 flex h-14 items-center gap-2 sm:gap-4 px-3 sm:px-4">
      {isMobile ? (
        <Button variant="ghost" size="icon" className="-ml-1 h-9 w-9" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      ) : (
        <SidebarTrigger className="-ml-1" />
      )}

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div onClick={() => setMobileMenuOpen(false)}>
            <AppSidebar />
          </div>
        </SheetContent>
      </Sheet>

      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {searchLoading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />}
        <Input
          placeholder="Buscar clientes, orçamentos, pedidos..."
          className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
        />
        {searchOpen && search.trim().length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
            {results.length > 0 ? (
              results.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  className="w-full px-3 py-2.5 text-left text-sm hover:bg-accent flex items-center gap-3 border-b border-border/30 last:border-0"
                  onMouseDown={() => { navigate(r.url); setSearch(""); setSearchOpen(false); }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{r.label}</p>
                    {r.detail && <p className="text-xs text-muted-foreground truncate">{r.detail}</p>}
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${typeBadgeColors[r.type] || "bg-muted text-muted-foreground"}`}>
                    {r.type}
                  </span>
                </button>
              ))
            ) : !searchLoading ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Nenhum resultado para "{search}"
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggle} className="h-9 w-9">
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-0.5 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 p-0">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <span className="font-semibold text-sm">Notificações</span>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={markAllAsRead}>
                  <CheckCheck className="h-3 w-3" /> Marcar todas lidas
                </Button>
              )}
            </div>
            <ScrollArea className="max-h-80">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Nenhuma notificação
                </div>
              ) : (
                notifications.map((n) => {
                  const config = typeConfig[n.type];
                  const Icon = config.icon;
                  return (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full text-left px-4 py-3 border-b last:border-0 flex gap-3 items-start hover:bg-accent/50 transition-colors ${
                        n.read ? "opacity-50" : ""
                      }`}
                    >
                      <div className={`mt-0.5 shrink-0 h-7 w-7 rounded-full bg-muted flex items-center justify-center ${config.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{n.msg}</p>
                        {n.detail && (
                          <p className="text-xs text-muted-foreground mt-0.5">{n.detail}</p>
                        )}
                        <p className="text-[11px] text-muted-foreground mt-1">{n.time} atrás</p>
                      </div>
                      {!n.read && (
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {initials}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <Badge variant="secondary" className="text-[10px] mt-1">{roleLabel}</Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/configuracoes")}>
              <User className="mr-2 h-4 w-4" /> Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
