import { Bell, AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { AppNotification } from "@/hooks/use-notifications";

interface NotificacoesSummaryProps {
  notifications: AppNotification[];
  unreadCount: number;
}

export function NotificacoesSummary({ notifications, unreadCount }: NotificacoesSummaryProps) {
  const criticalCount = notifications.filter((n) => n.severity === "critical" && !n.read).length;
  const warningCount = notifications.filter((n) => n.severity === "warning" && !n.read).length;

  const cards = [
    { value: unreadCount, label: "Não lidas", icon: Bell, iconClass: "text-primary", bgClass: "bg-primary/10" },
    { value: criticalCount, label: "Críticas", icon: AlertTriangle, iconClass: "text-destructive", bgClass: "bg-destructive/10" },
    { value: warningCount, label: "Avisos", icon: AlertCircle, iconClass: "text-warning", bgClass: "bg-warning/10" },
    { value: notifications.length, label: "Total", icon: Info, iconClass: "text-muted-foreground", bgClass: "bg-muted" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-lg border p-3 bg-card">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full ${card.bgClass} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${card.iconClass}`} />
              </div>
              <div>
                <p className="text-xl font-bold">{card.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{card.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
