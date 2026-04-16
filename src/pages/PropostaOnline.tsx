import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, Printer, Share2, Download } from "lucide-react";
import { decodeProposalFromUrl, formatCurrency, type ProposalData } from "@/utils/proposal/onlineProposal";

export default function PropostaOnline() {
  const { token } = useParams();
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (token) {
      // Try to decode from URL
      const proposalData = decodeProposalFromUrl(token);
      if (proposalData) {
        setProposal(proposalData);
      }
      setLoading(false);
    }
  }, [token]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Error
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <X className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Proposta Não Encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta proposta pode ter expirado ou o link está incorreto.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Entre em contato com o fornecedor para receber um novo link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = new Date(proposal.validUntil) < new Date();
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">
            {proposal.companyName || "AluFlow"}
          </h1>
          <p className="text-muted-foreground">Proposta Comercial</p>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Badge className={statusColors[isExpired ? "expired" : proposal.status]}>
                  {isExpired ? "EXPIRADA" : proposal.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Proposta #{proposal.id}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  <Share2 className="h-4 w-4 mr-1" />
                  {copied ? "Copiado!" : "Compartilhar"}
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-1" />
                  Imprimir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Dados do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{proposal.client.name}</p>
              </div>
              {proposal.client.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{proposal.client.email}</p>
                </div>
              )}
              {proposal.client.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{proposal.client.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Validade</p>
                <p className="font-medium text-primary">
                  {new Date(proposal.validUntil).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Itens da Proposta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Descrição</th>
                    <th className="text-center py-2">Qtd</th>
                    <th className="text-center py-2">Unidade</th>
                    <th className="text-right py-2">Valor Unit.</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {proposal.items.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{item.description}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center">{item.unit}</td>
                      <td className="text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="text-right font-medium">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(proposal.subtotal)}</span>
              </div>
              {proposal.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>-{formatCurrency(proposal.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(proposal.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {proposal.notes && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {proposal.notes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {!isExpired && proposal.status === "pending" && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Para aprovar ou recusar esta proposta, entre em contato com o fornecedor.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" className="gap-2">
                  <X className="h-4 w-4" />
                  Recusar
                </Button>
                <Button className="gap-2 bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4" />
                  Aprovar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Proposta gerada por AluFlow - Sistema de Gestão para Esquadrias de Alumínio</p>
          <p className="mt-1">
            <Clock className="h-3 w-3 inline mr-1" />
            Validade: {new Date(proposal.validUntil).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  );
}
