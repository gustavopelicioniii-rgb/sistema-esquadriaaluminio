import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface AppNotification {
  id: string;
  type: "estoque" | "pagamento" | "producao";
  msg: string;
  detail?: string;
  time: string;
  read: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    const now = new Date().toISOString().split("T")[0];

    // Fetch low stock items
    const { data: estoque } = await supabase
      .from("estoque")
      .select("id, produto, quantidade, minimo, updated_at")
      .order("updated_at", { ascending: false });

    const lowStock: AppNotification[] = (estoque ?? [])
      .filter((e) => e.quantidade <= e.minimo)
      .map((e) => ({
        id: `est-${e.id}`,
        type: "estoque" as const,
        msg: `Estoque baixo: ${e.produto}`,
        detail: `${e.quantidade}/${e.minimo} unid.`,
        time: timeAgo(e.updated_at),
        read: false,
      }));

    // Fetch overdue payments
    const { data: contas } = await supabase
      .from("contas_financeiras")
      .select("id, cliente, valor, vencimento, updated_at")
      .eq("status", "pendente")
      .lte("vencimento", now)
      .order("vencimento", { ascending: true });

    const overdue: AppNotification[] = (contas ?? []).map((c) => ({
      id: `fin-${c.id}`,
      type: "pagamento" as const,
      msg: `Pagamento vencido: ${c.cliente}`,
      detail: `R$ ${Number(c.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      time: timeAgo(c.updated_at),
      read: false,
    }));

    // Fetch recent production updates (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const { data: pedidos } = await supabase
      .from("pedidos")
      .select("id, pedido_num, cliente, etapa, updated_at")
      .gte("updated_at", weekAgo)
      .order("updated_at", { ascending: false })
      .limit(10);

    const production: AppNotification[] = (pedidos ?? [])
      .filter((p) => p.etapa)
      .map((p) => ({
        id: `prod-${p.id}`,
        type: "producao" as const,
        msg: `Pedido #${p.pedido_num} - ${p.cliente}`,
        detail: `Etapa: ${p.etapa}`,
        time: timeAgo(p.updated_at),
        read: false,
      }));

    setNotifications([...lowStock, ...overdue, ...production]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notifications-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "estoque" }, () => fetchNotifications())
      .on("postgres_changes", { event: "*", schema: "public", table: "contas_financeiras" }, () => fetchNotifications())
      .on("postgres_changes", { event: "*", schema: "public", table: "pedidos" }, () => fetchNotifications())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}
