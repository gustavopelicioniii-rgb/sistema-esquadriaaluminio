import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const Configuracoes = () => {
  const handleSave = () => {
    toast({ title: "Configurações salvas", description: "Suas alterações foram salvas com sucesso." });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground text-sm">Gerencie as configurações do sistema</p>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome da Empresa</Label>
              <Input defaultValue="AlumPRO Esquadrias" />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input defaultValue="12.345.678/0001-90" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input defaultValue="(11) 3456-7890" />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input defaultValue="contato@alumpro.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Margem Padrão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Margem de Lucro (%)</Label>
              <Input type="number" defaultValue={35} />
            </div>
            <div className="space-y-2">
              <Label>Desconto Máximo (%)</Label>
              <Input type="number" defaultValue={15} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>Salvar Configurações</Button>
    </div>
  );
};

export default Configuracoes;
