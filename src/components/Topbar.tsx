import { useState, useMemo } from "react";
import { Bell, Search, User, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const searchableItems = [
  { label: "Igor Soares de Souza", type: "Cliente", url: "/clientes" },
  { label: "Maria Santos", type: "Cliente", url: "/clientes" },
  { label: "Carlos Oliveira", type: "Cliente", url: "/clientes" },
  { label: "#1042 - Vidraçaria Norte SP", type: "Orçamento", url: "/orcamentos" },
  { label: "#1043 - Construtora Silva Ltda", type: "Orçamento", url: "/orcamentos" },
  { label: "Perfil Montante 40x25", type: "Estoque", url: "/estoque" },
  { label: "Vidro Temperado 8mm", type: "Estoque", url: "/estoque" },
  { label: "Fechadura Multiponto", type: "Estoque", url: "/estoque" },
];

const notifications = [
  { id: "1", msg: "Estoque baixo: Fechadura Multiponto (8 pçs)", time: "10 min", read: false },
  { id: "2", msg: "Orçamento #1043 aguardando aprovação", time: "1h", read: false },
  { id: "3", msg: "Instalação agendada para amanhã - Empresa Modelo", time: "3h", read: false },
];

export function Topbar() {
  const { theme, toggle } = useTheme();
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const results = useMemo(() => {
    if (!search.trim()) return [];
    const s = search.toLowerCase();
    return searchableItems.filter((i) => i.label.toLowerCase().includes(s)).slice(0, 8);
  }, [search]);

  const unread = notifications.filter((n) => !n.read).length;
  const initials = user?.email?.slice(0, 2).toUpperCase() || "??";
  const roleLabel = role === "admin" ? "Admin" : "Funcionário";

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="topbar-glass sticky top-0 z-30 flex h-14 items-center gap-2 sm:gap-4 px-3 sm:px-4">
      <SidebarTrigger className="-ml-1" />

      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes, orçamentos, produtos..."
          className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
        />
        {searchOpen && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden">
            {results.map((r, i) => (
              <button key={i} className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex justify-between items-center"
                onMouseDown={() => { navigate(r.url); setSearch(""); setSearchOpen(false); }}>
                <span className="font-medium">{r.label}</span>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{r.type}</span>
              </button>
            ))}
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
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">{unread}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="px-4 py-3 border-b font-semibold text-sm">Notificações</div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className={`px-4 py-3 border-b last:border-0 text-sm ${n.read ? "opacity-60" : ""}`}>
                  <p className="text-foreground">{n.msg}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time} atrás</p>
                </div>
              ))}
            </div>
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
