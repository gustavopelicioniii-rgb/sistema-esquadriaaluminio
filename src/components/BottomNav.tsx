import { Home, FileText, Wrench, DollarSign, LayoutGrid } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { to: "/", icon: Home, label: "Início" },
  { to: "/orcamentos", icon: FileText, label: "Orçamentos" },
  { to: "/producao", icon: Wrench, label: "Serviços" },
  { to: "/financeiro", icon: DollarSign, label: "Financeiro" },
];

const moreItems = [
  { to: "/relatorios", label: "Relatórios" },
  { to: "/clientes", label: "Clientes" },
  { to: "/agenda", label: "Agenda" },
  { to: "/projeto-vidro", label: "Projeto Vidro" },
  { to: "/configuracoes", label: "Configurações" },
];

export function BottomNav() {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setMoreOpen(false)}>
          <div className="absolute bottom-16 left-0 right-0 bg-card/98 backdrop-blur-lg border-t border-border/60 rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-200"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 gap-1 p-3">
              {moreItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex items-center justify-center py-3 px-2 rounded-xl text-xs font-medium transition-colors",
                    isActive(item.to) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-md sm:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px] min-h-[44px] active:scale-95",
                  active ? "text-primary scale-105" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "relative flex items-center justify-center transition-all duration-200",
                  active && "after:absolute after:-bottom-1 after:h-0.5 after:w-4 after:rounded-full after:bg-primary"
                )}>
                  <item.icon className={cn("h-5 w-5 transition-all duration-200", active && "text-primary")} />
                </div>
                <span className={cn("text-[10px] font-medium transition-all duration-200", active && "font-semibold")}>{item.label}</span>
              </NavLink>
            );
          })}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px] min-h-[44px] active:scale-95",
              moreOpen ? "text-primary scale-105" : "text-muted-foreground"
            )}
          >
            <LayoutGrid className={cn("h-5 w-5 transition-all duration-200", moreOpen && "text-primary")} />
            <span className={cn("text-[10px] font-medium", moreOpen && "font-semibold")}>Mais</span>
          </button>
        </div>
      </nav>
    </>
  );
}
