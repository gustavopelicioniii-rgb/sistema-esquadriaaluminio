import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export type NotificationType = "estoque" | "pagamento" | "producao" | "crm";

export interface AppNotification {
  id: string;
  type: NotificationType;
  msg: string;
  detail?: string;
  time: string;
  read: boolean;
  severity: "info" | "warning" | "critical";
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

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const prevCountRef = useRef(0);
  const initialLoadRef = useRef(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    const now = new Date().toISOString().split("T")[0];

    const [estoqueRes, contasRes, pedidosRes, crmRes] = await Promise.all([
      supabase.from("estoque").select("id, produto, quantidade, minimo, updated_at").order("updated_at", { ascending: false }),
      supabase.from("contas_financeiras").select("id, cliente, valor, vencimento, updated_at, tipo").eq("status", "pendente").order("vencimento", { ascending: true }),
      supabase.from("pedidos").select("id, pedido_num, cliente, etapa, status, previsao, updated_at").order("updated_at", { ascending: false }),
      supabase.from("crm_leads").select("id, nome, status, follow_up_date, valor, updated_at").order("updated_at", { ascending: false }),
    ]);

    const allNotifs: AppNotification[] = [];

    // === ESTOQUE BAIXO ===
    (estoqueRes.data ?? [])
      .filter((e) => e.quantidade <= e.minimo)
      .forEach((e) => {
        const ratio = e.minimo > 0 ? e.quantidade / e.minimo : 0;
        allNotifs.push({
          id: `est-${e.id}`,
          type: "estoque",
          msg: `Estoque baixo: ${e.produto}`,
          detail: `${e.quantidade}/${e.minimo} unid.`,
          time: timeAgo(e.updated_at),
          read: false,
          severity: ratio <= 0.25 ? "critical" : "warning",
        });
      });

    // === CONTAS VENCIDAS E PRÓXIMAS DO VENCIMENTO ===
    (contasRes.data ?? []).forEach((c) => {
      const days = daysUntil(c.vencimento);
      const valor = `R$ ${Number(c.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
      const tipoLabel = c.tipo === "receber" ? "A receber" : "A pagar";

      if (days < 0) {
        allNotifs.push({
          id: `fin-${c.id}`,
          type: "pagamento",
          msg: `${tipoLabel} vencido: ${c.cliente}`,
          detail: `${valor} · venceu há ${Math.abs(days)} dia(s)`,
          time: timeAgo(c.updated_at),
          read: false,
          severity: "critical",
        });
      } else if (days <= 3) {
        allNotifs.push({
          id: `fin-${c.id}`,
          type: "pagamento",
          msg: `${tipoLabel} vence em breve: ${c.cliente}`,
          detail: `${valor} · vence em ${days} dia(s)`,
          time: timeAgo(c.updated_at),
          read: false,
          severity: "warning",
        });
      }
    });

    // === PEDIDOS ATRASADOS ===
    (pedidosRes.data ?? [])
      .filter((p) => p.status === "em_andamento" && p.previsao)
      .forEach((p) => {
        const days = daysUntil(p.previsao!);
        if (days < 0) {
          allNotifs.push({
            id: `ped-atraso-${p.id}`,
            type: "producao",
            msg: `Pedido #${p.pedido_num} atrasado`,
            detail: `${p.cliente} · ${Math.abs(days)} dia(s) de atraso`,
            time: timeAgo(p.updated_at),
            read: false,
            severity: "critical",
          });
        } else if (days <= 2) {
          allNotifs.push({
            id: `ped-prazo-${p.id}`,
            type: "producao",
            msg: `Pedido #${p.pedido_num} prazo próximo`,
            detail: `${p.cliente} · entrega em ${days} dia(s)`,
            time: timeAgo(p.updated_at),
            read: false,
            severity: "warning",
          });
        }
      });

    // === PRODUÇÃO RECENTE ===
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    (pedidosRes.data ?? [])
      .filter((p) => p.etapa && new Date(p.updated_at) >= new Date(weekAgo))
      .slice(0, 5)
      .forEach((p) => {
        allNotifs.push({
          id: `prod-${p.id}`,
          type: "producao",
          msg: `Pedido #${p.pedido_num} - ${p.cliente}`,
          detail: `Etapa: ${p.etapa}`,
          time: timeAgo(p.updated_at),
          read: false,
          severity: "info",
        });
      });

    // === CRM FOLLOW-UPS ===
    (crmRes.data ?? []).forEach((lead) => {
      if (!lead.follow_up_date) return;
      const days = daysUntil(lead.follow_up_date);
      const valor = Number(lead.valor) > 0
        ? ` · R$ ${Number(lead.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "";

      if (days < 0) {
        allNotifs.push({
          id: `crm-${lead.id}`,
          type: "crm",
          msg: `Follow-up atrasado: ${lead.nome}`,
          detail: `${Math.abs(days)} dia(s) de atraso${valor}`,
          time: timeAgo(lead.updated_at),
          read: false,
          severity: "critical",
        });
      } else if (days <= 1) {
        allNotifs.push({
          id: `crm-${lead.id}`,
          type: "crm",
          msg: `Follow-up hoje: ${lead.nome}`,
          detail: `Acompanhamento pendente${valor}`,
          time: timeAgo(lead.updated_at),
          read: false,
          severity: "warning",
        });
      } else if (days <= 3) {
        allNotifs.push({
          id: `crm-${lead.id}`,
          type: "crm",
          msg: `Follow-up em ${days} dias: ${lead.nome}`,
          detail: `Acompanhamento agendado${valor}`,
          time: timeAgo(lead.updated_at),
          read: false,
          severity: "info",
        });
      }
    });

    // Sort: critical first, then warning, then info
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    allNotifs.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    // Show toast for new critical notifications
    const criticalCount = allNotifs.filter((n) => n.severity === "critical").length;
    if (!initialLoadRef.current && criticalCount > prevCountRef.current) {
      const newCritical = allNotifs.filter((n) => n.severity === "critical");
      const newest = newCritical[0];
      if (newest) {
        toast.error(newest.msg, { description: newest.detail });
      }
    }
    prevCountRef.current = criticalCount;
    initialLoadRef.current = false;

    setNotifications(allNotifs);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notifications-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "estoque" }, () => fetchNotifications())
      .on("postgres_changes", { event: "*", schema: "public", table: "contas_financeiras" }, () => fetchNotifications())
      .on("postgres_changes", { event: "*", schema: "public", table: "pedidos" }, () => fetchNotifications())
      .on("postgres_changes", { event: "*", schema: "public", table: "crm_leads" }, () => fetchNotifications())
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
