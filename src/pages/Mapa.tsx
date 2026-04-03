import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/use-page-title";

const locais = [
  { nome: "Igor Soares de Souza", endereco: "Rua Teste, 1234, Caieiras, SP", telefone: "(11) 9602-2000", tipo: "Cliente" },
  { nome: "Empresa Modelo Ltda", endereco: "R. Arica Mirim, 12, São Paulo, SP", telefone: "(11) 97473-9209", tipo: "Cliente" },
  { nome: "Maria Santos", endereco: "Av. Brasil, 567, São Paulo, SP", telefone: "(11) 98888-5678", tipo: "Cliente" },
  { nome: "Carlos Oliveira", endereco: "Rua das Flores, 89, Rio de Janeiro, RJ", telefone: "(21) 97777-9012", tipo: "Obra" },
];

const Mapa = () => {
  usePageTitle("Mapa");

  const openMaps = (endereco: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mapa</h1>
        <p className="text-muted-foreground text-sm">Localização de clientes e obras</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-border/50 overflow-hidden h-[500px]">
            <iframe
              title="Mapa"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d467692.0488551408!2d-46.87529839999999!3d-23.6820635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce448183a461d1%3A0x9ba94b08ff335bae!2zU8OjbyBQYXVsbywgU1A!5e0!3m2!1spt-BR!2sbr!4v1"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Card>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Locais cadastrados</h3>
          {locais.map((local, i) => (
            <Card key={i} className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <User className="h-3 w-3 text-primary" />
                    {local.nome}
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openMaps(local.endereco)}>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
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
