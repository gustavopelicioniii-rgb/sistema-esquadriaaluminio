import { useState } from "react";
import { contasFinanceiras, formatCurrency, formatDate } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const Financeiro = () => {
  const receber = contasFinanceiras.filter((c) => c.tipo === "receber");
  const pagar = contasFinanceiras.filter((c) => c.tipo === "pagar");

  const totalReceber = receber.reduce((s, c) => s + c.valor, 0);
  const totalPago = pagar.filter((c) => c.status === "pago").reduce((s, c) => s + c.valor, 0);
  const inadimplencia = receber.filter((c) => c.status === "atrasado").reduce((s, c) => s + c.valor, 0);

  const renderTable = (contas: typeof contasFinanceiras) => (
    <div className="rounded-lg border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contas.map((conta) => (
            <TableRow key={conta.id}>
              <TableCell className="font-medium">{conta.id}</TableCell>
              <TableCell>{conta.descricao}</TableCell>
              <TableCell className="font-semibold">{formatCurrency(conta.valor)}</TableCell>
              <TableCell>{formatDate(conta.data)}</TableCell>
              <TableCell><StatusBadge status={conta.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground text-sm">Controle financeiro da empresa</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total a Receber" value={formatCurrency(totalReceber)} icon={TrendingUp} />
        <StatCard title="Total Pago" value={formatCurrency(totalPago)} icon={TrendingDown} />
        <StatCard title="Inadimplência" value={formatCurrency(inadimplencia)} icon={AlertTriangle} />
      </div>

      <Tabs defaultValue="receber">
        <TabsList>
          <TabsTrigger value="receber">Contas a Receber</TabsTrigger>
          <TabsTrigger value="pagar">Contas a Pagar</TabsTrigger>
        </TabsList>
        <TabsContent value="receber" className="mt-4">
          {renderTable(receber)}
        </TabsContent>
        <TabsContent value="pagar" className="mt-4">
          {renderTable(pagar)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financeiro;
