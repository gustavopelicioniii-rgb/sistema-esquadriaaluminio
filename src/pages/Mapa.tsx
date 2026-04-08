import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, User, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/use-page-title";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Mapa = () => {
  usePageTitle("Mapa");

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ["clientes_mapa"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("id, nome, endereco, telefone, cidade")
        .order("nome");
      if (error) throw error;
      return data ?? [];
    },
  });

  const locais = clientes.filter((c) => c.endereco?.trim());

  const openMaps = (endereco: string) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mapa</h1>
        <p className="text-muted-foreground text-sm">
          Localização de clientes e obras
        </p>
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
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {!isLoading && locais.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum cliente com endereço cadastrado.
            </p>
          )}
          {locais.map((local) => (
            <Card
              key={local.id}
              className="shadow-sm border-border/50 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <User className="h-3 w-3 text-primary" />
                    {local.nome}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => openMaps(local.endereco!)}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                  {local.endereco}
                  {local.cidade ? `, ${local.cidade}` : ""}
                </div>
                {local.telefone && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {local.telefone}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mapa;
