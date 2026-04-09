import { Home, FileText, Wrench, DollarSign, BarChart3 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Início" },
  { to: "/orcamentos", icon: FileText, label: "Orçamentos" },
  { to: "/producao", icon: Wrench, label: "Serviços" },
  { to: "/financeiro", icon: DollarSign, label: "Financeiro" },
  { to: "/relatorios", icon: BarChart3, label: "Relatórios" },
];

export function BottomNav() {
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-md sm:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[56px]",
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
      </div>
    </nav>
  );
}
