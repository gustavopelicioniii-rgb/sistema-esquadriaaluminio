import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Clock, CheckCircle, Package, Truck, Home, Phone, Mail, MessageCircle, Send, History } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TrackingEvent {
  id: string;
  pedido_id: string;
  etapa: string;
  status: string;
  observacao: string;
  notify_client: boolean;
  created_at: string;
}

interface Pedido {
  id: string;
  pedido_num: number;
  cliente: string;
  telefone: string;
  email: string;
  endereco: string;
  status: string;
  etapa: string;
}

const etapasPedido = [
  { key: "orcamento", label: "Orçamento", icon: ClipboardIcon },
  { key: "aprovado", label: "Aprovado", icon: CheckCircle },
  { key: "medicao", label: "Medição", icon: RulerIcon },
  { key: "producao", label: "Produção", icon: FactoryIcon },
  { key: "pintura", label: "Pintura/Anodização", icon: PaintIcon },
  { key: "montagem", label: "Montagem", icon: WrenchIcon },
  { key: "instalacao", label: "Instalação", icon: Home },
  { key: "entrega", label: "Entrega", icon: Truck },
  { key: "finalizado", label: "Finalizado", icon: CheckCircle },
];

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
    </svg>
  );
}

function RulerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21.239 14.239c-1.768-1.768-4.132-2.186-6.19-1.237M3 10h11M8 3l3 3 3-3M3 17h4v4" />
    </svg>
  );
}

function FactoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    </svg>
  );
}

function PaintIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 11H5a4 4 0 0 0-4 4v6h22v-6a4 4 0 0 0-4-4Z" />
      <path d="M12 11V3" />
      <path d="M8 7l4-4 4 4" />
    </svg>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
    </svg>
  );
}

interface PedidoTrackingProps {
  pedido: Pedido;
  onClose?: () => void;
  embedded?: boolean;
}

export default function PedidoTracking({ pedido, onClose, embedded }: PedidoTrackingProps) {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ etapa: "", status: "andamento", observacao: "", notify_client: false });

  const loadEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("tracking_events")
        .select("*")
        .eq("pedido_id", pedido.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (err: unknown) {
      toast.error("Erro ao carregar eventos:", err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEvents();
  }, [pedido.id, loadEvents]);

  const handleAddEvent = async () => {
    if (!newEvent.etapa) {
      toast.error("Selecione uma etapa");
      return;
    }

    try {
      const { error } = await supabase.from("tracking_events").insert([{
        pedido_id: pedido.id,
        etapa: newEvent.etapa,
        status: newEvent.status,
        observacao: newEvent.observacao,
        notify_client: newEvent.notify_client,
      }]);

      if (error) throw error;

      // Update pedido etapa
      await supabase
        .from("pedidos")
        .update({ etapa: newEvent.etapa, etapa_data: new Date().toISOString() })
        .eq("id", pedido.id);

      toast.success("Evento adicionado!");
      setDialogOpen(false);
      setNewEvent({ etapa: "", status: "andamento", observacao: "", notify_client: false });
      loadEvents();

      if (newEvent.notify_client) {
        toast.info("Cliente será notificado!");
      }
    } catch (err: any) {
      toast.error("Erro ao adicionar:", err.message);
    }
  };

  const getEtapaIndex = (etapa: string) => {
    return etapasPedido.findIndex(e => e.key === etapa);
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  const currentEtapaIndex = getEtapaIndex(pedido.etapa);

  return (
    <Card className={embedded ? "border-0 shadow-none" : ""}>
      {!embedded && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pedido #{pedido.pedido_num}</CardTitle>
              <CardDescription>Acompanhamento em tempo real</CardDescription>
            </div>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        {/* Client Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{pedido.cliente}</span>
          </div>
          {pedido.telefone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{pedido.telefone}</span>
            </div>
          )}
          {pedido.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{pedido.email}</span>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="font-medium">Nenhum acompanhamento ainda</p>
                <p className="text-sm text-muted-foreground">Clique em "Atualizar" para iniciar</p>
              </div>
            ) : (
              events.map((event, index) => {
                const etapaIdx = getEtapaIndex(event.etapa);
                const isCompleted = event.status === "completed" || event.status === "concluido";
                const isCurrent = index === events.length - 1;

                return (
                  <div key={event.id} className="relative flex gap-4 pl-10">
                    <div className={cn(
                      "absolute left-0 h-8 w-8 rounded-full flex items-center justify-center z-10",
                      isCompleted ? "bg-green-500" : isCurrent ? "bg-primary" : "bg-muted"
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className={cn(
                      "flex-1 p-4 rounded-lg border",
                      isCurrent && "bg-primary/5 border-primary/20"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">
                          {etapasPedido.find(e => e.key === event.etapa)?.label || event.etapa}
                        </p>
                        <Badge variant={isCompleted ? "default" : "outline"}>
                          {isCompleted ? "Concluído" : "Em andamento"}
                        </Badge>
                      </div>
                      {event.observacao && (
                        <p className="text-sm text-muted-foreground mb-2">{event.observacao}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(event.created_at)}</span>
                        {event.notify_client && (
                          <Badge variant="secondary" className="text-xs">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Cliente notificado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {events.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Início</span>
              <span>Finalização</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-green-500 transition-all"
                style={{ width: `${Math.min(100, (currentEtapaIndex / (etapasPedido.length - 1)) * 100)}%` }}
              />
            </div>
            <p className="text-center text-sm font-medium">
              {etapasPedido[currentEtapaIndex]?.label || "Etapa atual"} — {Math.round((currentEtapaIndex / (etapasPedido.length - 1)) * 100)}%
            </p>
          </div>
        )}
      </CardContent>

      {/* Add Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Acompanhamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Etapa *</Label>
              <select
                className="w-full h-10 px-3 border rounded-md bg-background"
                value={newEvent.etapa}
                onChange={(e) => setNewEvent({ ...newEvent, etapa: e.target.value })}
              >
                <option value="">Selecione a etapa...</option>
                {etapasPedido.map(e => (
                  <option key={e.key} value={e.key}>{e.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="w-full h-10 px-3 border rounded-md bg-background"
                value={newEvent.status}
                onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
              >
                <option value="andamento">Em andamento</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Observação</Label>
              <Textarea
                placeholder="Ex: Instalação agendada para amanhã..."
                value={newEvent.observacao}
                onChange={(e) => setNewEvent({ ...newEvent, observacao: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="notify"
                checked={newEvent.notify_client}
                onCheckedChange={(checked) => setNewEvent({ ...newEvent, notify_client: !!checked })}
              />
              <Label htmlFor="notify" className="cursor-pointer">
                Notificar cliente via WhatsApp
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddEvent} className="gap-2">
              <Send className="h-4 w-4" />
              Atualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
