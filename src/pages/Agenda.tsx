import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays, Clock, MapPin, User } from "lucide-react";

const eventosMock = [
  { id: "1", titulo: "Medição - Igor Soares", data: "08/04/2026", hora: "09:00", local: "Rua Teste, 1234, Caieiras", responsavel: "Igor Soares" },
  { id: "2", titulo: "Instalação - Empresa Modelo", data: "09/04/2026", hora: "14:00", local: "R. Arica Mirim, 12", responsavel: "Carlos Silva" },
  { id: "3", titulo: "Conferência - Maria Santos", data: "10/04/2026", hora: "10:30", local: "Av. Brasil, 567", responsavel: "Igor Soares" },
  { id: "4", titulo: "Entrega - Pedro Souza", data: "11/04/2026", hora: "08:00", local: "Rua Paraná, 456, Curitiba", responsavel: "Marcos Pereira" },
  { id: "5", titulo: "Visita técnica - Ana Costa", data: "12/04/2026", hora: "15:00", local: "Rua Minas, 321, BH", responsavel: "Igor Soares" },
];

const Agenda = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground text-sm">Compromissos e eventos agendados</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Evento
        </Button>
      </div>

      <div className="space-y-3">
        {eventosMock.map((evento) => (
          <Card key={evento.id} className="shadow-sm border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{evento.titulo}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{evento.data}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{evento.hora}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{evento.local}</span>
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{evento.responsavel}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">Ver detalhes</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Agenda;
