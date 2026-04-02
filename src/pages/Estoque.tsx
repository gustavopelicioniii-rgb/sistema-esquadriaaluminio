import { itensEstoque } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Estoque = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Estoque</h1>
        <p className="text-muted-foreground text-sm">Controle de materiais e insumos</p>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Mínimo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itensEstoque.map((item) => {
              const baixo = item.quantidade <= item.minimo;
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.produto}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{item.categoria}</Badge>
                  </TableCell>
                  <TableCell className={baixo ? "text-destructive font-bold" : "font-medium"}>
                    {item.quantidade} {item.unidade}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.minimo} {item.unidade}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${baixo ? "text-destructive" : "text-success"}`}>
                      <span className={`h-2 w-2 rounded-full ${baixo ? "bg-destructive" : "bg-success"}`} />
                      {baixo ? "Baixo Estoque" : "Normal"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Estoque;
