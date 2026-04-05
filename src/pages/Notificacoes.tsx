import { useState } from "react";
import { useNotifications, type AppNotification } from "@/hooks/use-notifications";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Button } from "@/components/ui/button";
import { CheckCheck, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { typeConfig, type FilterType, type FilterStatus } from "@/components/notificacoes/notificacoes-config";
import { NotificacoesSummary } from "@/components/notificacoes/NotificacoesSummary";
import { DesktopFilters, MobileTypeFilter, MobileStatusFilter } from "@/components/notificacoes/NotificacoesFilters";
import { NotificacoesList } from "@/components/notificacoes/NotificacoesList";

const Notificacoes = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [filterType, setFilterType] = useState<FilterType>("todos");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todos");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const filtered = notifications.filter((n) => {
    if (filterType !== "todos" && n.type !== filterType) return false;
    if (filterStatus === "lidas" && !n.read) return false;
    if (filterStatus === "nao_lidas" && n.read) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map((n) => n.id)));
  };

  const markSelectedAsRead = () => {
    selected.forEach((id) => markAsRead(id));
    setSelected(new Set());
  };

  const handleClick = (n: AppNotification) => {
    markAsRead(n.id);
    navigate(typeConfig[n.type].route);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={async () => {}}>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight">Central de Notificações</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {unreadCount} não lidas · {notifications.length} total
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={markAllAsRead}>
              <CheckCheck className="h-3.5 w-3.5" />
              Marcar todas lidas
            </Button>
          )}
        </div>

        <NotificacoesSummary notifications={notifications} unreadCount={unreadCount} />

        <MobileTypeFilter notifications={notifications} filterType={filterType} onFilterType={setFilterType} />

        <div className="flex gap-6">
          <DesktopFilters
            notifications={notifications}
            filterType={filterType}
            filterStatus={filterStatus}
            onFilterType={setFilterType}
            onFilterStatus={setFilterStatus}
          />

          <div className="flex-1 min-w-0 space-y-3">
            <MobileStatusFilter filterStatus={filterStatus} onFilterStatus={setFilterStatus} />
            <NotificacoesList
              filtered={filtered}
              selected={selected}
              filterType={filterType}
              filterStatus={filterStatus}
              onToggleSelect={toggleSelect}
              onSelectAll={selectAll}
              onMarkSelectedRead={markSelectedAsRead}
              onClickNotification={handleClick}
            />
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
};

export default Notificacoes;
