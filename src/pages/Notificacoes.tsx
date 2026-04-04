import { useState } from "react";
import { useNotifications, type AppNotification, type NotificationType } from "@/hooks/use-notifications";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Bell, Package, DollarSign, Wrench, Users, CheckCheck, Trash2, Eye,
  Filter, Loader2, AlertTriangle, AlertCircle, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const typeConfig: Record<NotificationType, { icon: typeof Package; label: string; color: string; bgColor: string; route: string }> = {
  estoque: { icon: Package, label: "Estoque", color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-100 dark:bg-orange-900/30", route: "/estoque" },
  pagamento: { icon: DollarSign, label: "Financeiro", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/30", route: "/financeiro" },
  producao: { icon: Wrench, label: "Produção", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/30", route: "/producao" },
  crm: { icon: Users, label: "CRM", color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-100 dark:bg-purple-900/30", route: "/crm" },
};

const severityConfig = {
  critical: { icon: AlertTriangle, label: "Crítico", color: "text-destructive", bgColor: "bg-destructive/10" },
  warning: { icon: AlertCircle, label: "Aviso", color: "text-warning", bgColor: "bg-warning/10" },
  info: { icon: Info, label: "Info", color: "text-muted-foreground", bgColor: "bg-muted" },
};

type FilterType = "todos" | NotificationType;
type FilterStatus = "todos" | "lidas" | "nao_lidas";

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
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((n) => n.id)));
    }
  };

  const markSelectedAsRead = () => {
    selected.forEach((id) => markAsRead(id));
    setSelected(new Set());
  };

  const handleClick = (n: AppNotification) => {
    markAsRead(n.id);
    navigate(typeConfig[n.type].route);
  };

  const typeFilterItems: { key: FilterType; label: string; icon: typeof Bell }[] = [
    { key: "todos", label: "Todos", icon: Bell },
    { key: "estoque", label: "Estoque", icon: Package },
    { key: "pagamento", label: "Financeiro", icon: DollarSign },
    { key: "producao", label: "Produção", icon: Wrench },
    { key: "crm", label: "CRM", icon: Users },
  ];

  const statusFilterItems: { key: FilterStatus; label: string }[] = [
    { key: "todos", label: "Todas" },
    { key: "nao_lidas", label: "Não lidas" },
    { key: "lidas", label: "Lidas" },
  ];

  const getCounts = (type: FilterType) =>
    type === "todos" ? notifications.length : notifications.filter((n) => n.type === type).length;

  const criticalCount = notifications.filter((n) => n.severity === "critical" && !n.read).length;
  const warningCount = notifications.filter((n) => n.severity === "warning" && !n.read).length;

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
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight">Central de Notificações</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {unreadCount} não lidas · {notifications.length} total
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={markAllAsRead}>
                <CheckCheck className="h-3.5 w-3.5" />
                Marcar todas lidas
              </Button>
            )}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border p-3 bg-card">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{unreadCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Não lidas</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-3 bg-card">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-xl font-bold">{criticalCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Críticas</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-3 bg-card">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-xl font-bold">{warningCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avisos</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-3 bg-card">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold">{notifications.length}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile type filter tabs */}
        <div className="md:hidden overflow-x-auto">
          <div className="flex gap-1 p-1 rounded-lg border bg-muted/50 w-fit">
            {typeFilterItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setFilterType(item.key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0",
                    filterType === item.key ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {item.label}
                  <span className={cn(
                    "flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] font-bold",
                    filterType === item.key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {getCounts(item.key)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop sidebar filters */}
          <div className="w-52 shrink-0 space-y-6 hidden md:block">
            {/* Type filter */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <Filter className="h-3 w-3 inline mr-1" />
                FILTRAR POR TIPO
              </p>
              <div className="space-y-0.5">
                {typeFilterItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setFilterType(item.key)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        filterType === item.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" />
                        {item.label}
                      </span>
                      <span className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] font-bold",
                        filterType === item.key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {getCounts(item.key)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status filter */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">STATUS</p>
              <div className="space-y-0.5">
                {statusFilterItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFilterStatus(item.key)}
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      filterStatus === item.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 space-y-3 min-w-0">
            {/* Batch actions bar */}
            {filtered.length > 0 && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg border bg-card">
                <Checkbox
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onCheckedChange={selectAll}
                />
                <span className="text-xs text-muted-foreground">
                  {selected.size > 0
                    ? `${selected.size} selecionada(s)`
                    : "Selecionar todas"}
                </span>
                {selected.size > 0 && (
                  <div className="ml-auto flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={markSelectedAsRead}>
                      <Eye className="h-3 w-3" />
                      Marcar lidas
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile status filter */}
            <div className="md:hidden flex gap-1 mb-2">
              {statusFilterItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilterStatus(item.key)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                    filterStatus === item.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-muted-foreground border-border"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Notification list */}
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <Bell className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">Nenhuma notificação encontrada</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {filterType !== "todos" || filterStatus !== "todos"
                      ? "Tente ajustar os filtros"
                      : "Tudo em dia!"}
                  </p>
                </div>
              ) : (
                filtered.map((n) => {
                  const tc = typeConfig[n.type];
                  const sc = severityConfig[n.severity];
                  const Icon = tc.icon;
                  const SevIcon = sc.icon;
                  const isSelected = selected.has(n.id);

                  return (
                    <div
                      key={n.id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 border-b last:border-0 transition-colors group",
                        n.read ? "opacity-60 bg-muted/20" : "bg-card",
                        isSelected && "bg-primary/5"
                      )}
                    >
                      <div className="pt-0.5">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelect(n.id)}
                        />
                      </div>

                      <div
                        className={cn(
                          "mt-0.5 shrink-0 h-9 w-9 rounded-full flex items-center justify-center",
                          tc.bgColor, tc.color
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <button
                        onClick={() => handleClick(n)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{n.msg}</p>
                          {!n.read && (
                            <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        {n.detail && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.detail}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                            tc.bgColor, tc.color
                          )}>
                            {tc.label}
                          </span>
                          <span className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5",
                            sc.bgColor, sc.color
                          )}>
                            <SevIcon className="h-2.5 w-2.5" />
                            {sc.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {n.time} atrás
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
};

export default Notificacoes;
