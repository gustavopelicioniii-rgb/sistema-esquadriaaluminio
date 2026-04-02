import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, User } from "lucide-react";

const locais = [
  { nome: "Igor Soares de Souza", endereco: "Rua Teste, 1234, Caieiras, SP", telefone: "(11) 9602-2000", tipo: "Cliente" },
  { nome: "Empresa Modelo Ltda", endereco: "R. Arica Mirim, 12, 22312-231", telefone: "(11) 97473-9209", tipo: "Cliente" },
  { nome: "Maria Santos", endereco: "Av. Brasil, 567, São Paulo, SP", telefone: "(11) 98888-5678", tipo: "Cliente" },
  { nome: "Carlos Oliveira", endereco: "Rua das Flores, 89, Rio de Janeiro, RJ", telefone: "(21) 97777-9012", tipo: "Obra" },
];

const Mapa = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mapa</h1>
        <p className="text-muted-foreground text-sm">Localização de clientes e obras</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-border/50 h-[500px] flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Mapa será exibido aqui</p>
              <p className="text-sm mt-1">Integração com Google Maps em breve</p>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Locais cadastrados</h3>
          {locais.map((local, i) => (
            <Card key={i} className="shadow-sm border-border/50">
              <CardContent className="p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <User className="h-3 w-3 text-primary" />
                  {local.nome}
                </div>
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                  {local.endereco}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {local.telefone}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mapa;
