import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { VidroItem, calcAreaEfetiva } from "./types";

interface EditableRowProps {
  item: VidroItem;
  areaMinimaM2: number;
  precoM2: number;
  onSave: (updates: Partial<VidroItem>) => void;
  onCancel: () => void;
}

export function EditableRow({ item, areaMinimaM2, precoM2, onSave, onCancel }: EditableRowProps) {
  const [desc, setDesc] = useState(item.descricao);
  const [larg, setLarg] = useState(item.larguraMm);
  const [alt, setAlt] = useState(item.alturaMm);
  const [qtd, setQtd] = useState(item.quantidade);
  const [obs, setObs] = useState(item.observacao);

  const area = calcAreaEfetiva(larg, alt, areaMinimaM2) * qtd;

  return (
    <TableRow className="bg-primary/5">
      <TableCell>
        <Input value={desc} onChange={(e) => setDesc(e.target.value)} className="h-8 text-sm" />
        <Input value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Observação..." className="h-7 text-xs mt-1" />
      </TableCell>
      <TableCell><Input type="number" value={larg} onChange={(e) => setLarg(Number(e.target.value))} className="h-8 text-sm text-center w-20" /></TableCell>
      <TableCell><Input type="number" value={alt} onChange={(e) => setAlt(Number(e.target.value))} className="h-8 text-sm text-center w-20" /></TableCell>
      <TableCell><Input type="number" value={qtd} onChange={(e) => setQtd(Number(e.target.value))} min={1} className="h-8 text-sm text-center w-16" /></TableCell>
      <TableCell className="text-right font-mono text-sm">{area.toFixed(2)}</TableCell>
      <TableCell className="text-right font-semibold text-sm text-primary">{formatCurrency(area * precoM2)}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600" onClick={() => onSave({ descricao: desc, larguraMm: larg, alturaMm: alt, quantidade: qtd, observacao: obs })}>
            <Check className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCancel}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
