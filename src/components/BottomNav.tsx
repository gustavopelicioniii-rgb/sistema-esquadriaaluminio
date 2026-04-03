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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-md sm:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors min-w-[56px]",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", active && "text-primary")} />
              <span className={cn("text-[10px] font-medium", active && "font-semibold")}>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
