import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, CalendarDays, Clock, MapPin, User, ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/use-page-title";

interface Evento {
  id: string;
  titulo: string;
  data: string; // YYYY-MM-DD
  hora: string;
  local: string;
  responsavel: string;
}

const initialEventos: Evento[] = [
  { id: "1", titulo: "Medição - Igor Soares", data: "2026-04-08", hora: "09:00", local: "Rua Teste, 1234, Caieiras", responsavel: "Igor Soares" },
  { id: "2", titulo: "Instalação - Empresa Modelo", data: "2026-04-09", hora: "14:00", local: "R. Arica Mirim, 12", responsavel: "Carlos Silva" },
  { id: "3", titulo: "Conferência - Maria Santos", data: "2026-04-10", hora: "10:30", local: "Av. Brasil, 567", responsavel: "Igor Soares" },
  { id: "4", titulo: "Entrega - Pedro Souza", data: "2026-04-11", hora: "08:00", local: "Rua Paraná, 456, Curitiba", responsavel: "Marcos Pereira" },
  { id: "5", titulo: "Visita técnica - Ana Costa", data: "2026-04-15", hora: "15:00", local: "Rua Minas, 321, BH", responsavel: "Igor Soares" },
];

const emptyForm = { titulo: "", data: "", hora: "", local: "", responsavel: "" };
const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const Agenda = () => {
  usePageTitle("Agenda");
  const [eventos, setEventos] = useState<Evento[]>(initialEventos);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [year, month]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, Evento[]> = {};
    eventos.forEach((e) => { (map[e.data] ||= []).push(e); });
    return map;
  }, [eventos]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const openNew = (date?: string) => {
    setForm({ ...emptyForm, data: date || "" });
    setEditingId(null);
    setDialogOpen(true);
  };
  const openEdit = (e: Evento) => {
    setForm({ titulo: e.titulo, data: e.data, hora: e.hora, local: e.local, responsavel: e.responsavel });
    setEditingId(e.id);
    setDialogOpen(true);
  };
  const handleSave = () => {
    if (!form.titulo.trim() || !form.data) { toast({ title: "Preencha título e data", variant: "destructive" }); return; }
    if (editingId) {
      setEventos((prev) => prev.map((e) => e.id === editingId ? { ...e, ...form } : e));
      toast({ title: "Evento atualizado" });
    } else {
      setEventos((prev) => [...prev, { id: String(Date.now()), ...form }]);
      toast({ title: "Evento criado" });
    }
    setDialogOpen(false);
  };
  const handleDelete = (id: string) => {
    setEventos((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Evento removido", variant: "destructive" });
  };

  const dayEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground text-sm">Compromissos e eventos agendados</p>
        </div>
        <Button className="gap-2" onClick={() => openNew()}>
          <Plus className="h-4 w-4" /> Novo Evento
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                <h2 className="font-semibold">{MONTHS[month]} {year}</h2>
                <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
              </div>
              <div className="grid grid-cols-7 gap-px">
                {DAYS.map((d) => <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>)}
                {calendarDays.map((day, i) => {
                  if (day === null) return <div key={i} />;
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const hasEvents = !!eventsByDate[dateStr]?.length;
                  const isSelected = selectedDate === dateStr;
                  const isToday = dateStr === todayStr;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      onDoubleClick={() => openNew(dateStr)}
                      className={`relative h-12 sm:h-16 rounded-md text-sm transition-colors
                        ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"}
                        ${isToday && !isSelected ? "font-bold text-primary" : ""}
                      `}
                    >
                      {day}
                      {hasEvents && (
                        <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full ${isSelected ? "bg-primary-foreground" : "bg-primary"}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events sidebar */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">
            {selectedDate
              ? `Eventos em ${new Date(selectedDate + "T12:00").toLocaleDateString("pt-BR")}`
              : "Próximos eventos"}
          </h3>
          {(selectedDate ? dayEvents : eventos.slice(0, 5)).map((evento) => (
            <Card key={evento.id} className="shadow-sm border-border/50">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{evento.titulo}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{new Date(evento.data + "T12:00").toLocaleDateString("pt-BR")}</span>
                      {evento.hora && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{evento.hora}</span>}
                      {evento.local && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{evento.local}</span>}
                      {evento.responsavel && <span className="flex items-center gap-1"><User className="h-3 w-3" />{evento.responsavel}</span>}
                    </div>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(evento)}><Pencil className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(evento.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {selectedDate && dayEvents.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento nesta data.
              <Button variant="link" size="sm" onClick={() => openNew(selectedDate)}>Criar evento</Button>
            </p>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingId ? "Editar Evento" : "Novo Evento"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Título *</Label><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Data *</Label><Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Hora</Label><Input type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Local</Label><Input value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Responsável</Label><Input value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editingId ? "Salvar" : "Criar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Agenda;
