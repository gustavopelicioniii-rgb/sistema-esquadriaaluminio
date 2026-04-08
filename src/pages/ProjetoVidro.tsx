import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Monitor, ArrowLeft, Trash2, Edit2, Eye, Search, FileDown, Loader2,
  Copy, Upload, Check, X, FileSpreadsheet, BarChart3, MessageSquare,
} from "lucide-react";
import { exportProjetoVidroPDF } from "@/utils/projetoVidroPdfGenerator";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/formatters";
import { supabase } from "@/integrations/supabase/client";
import {
  VidroInteiro, Vidro1DivVertical, Vidro2DivVerticais,
  VidroGrade4, VidroGrade6, VidroBandeiraSuperior,
  VidroTravessaCentral, VidroAssimetrico, VidroGradeMultipla,
} from "@/components/tipologias/vidro-svgs";

const glassVariantToSvg: Record<string, React.FC> = {
  "comum": VidroInteiro,
  "temperado": VidroGrade4,
  "laminado": Vidro2DivVerticais,
  "temperado-laminado": VidroGrade6,
  "insulado": Vidro1DivVertical,
};

// Types
interface VidroItem {
  id: string;
  descricao: string;
  larguraMm: number;
  alturaMm: number;
  quantidade: number;
  observacao: string;
}

interface ProjetoVidro {
  id: string;
  titulo: string;
  tipo: string;
  espessura: string;
  cor: string;
  precoM2: number;
  areaMinimaM2: number;
  itens: VidroItem[];
  criadoEm: string;
}

const tiposVidro = ["Comum", "Temperado", "Laminado", "Temperado Laminado", "Insulado", "Serigrafado", "Espelhado", "Acidato"];
const espessuras = ["4mm", "6mm", "8mm", "10mm", "12mm", "15mm", "19mm"];
const cores = ["Incolor", "Fumê", "Verde", "Bronze", "Cinza", "Preto", "Branco Leitoso"];

function calcAreaM2(largMm: number, altMm: number): number {
  return (largMm * altMm) / 1_000_000;
}

function calcAreaEfetiva(largMm: number, altMm: number, areaMinimaM2: number): number {
  const real = calcAreaM2(largMm, altMm);
  return areaMinimaM2 > 0 ? Math.max(real, areaMinimaM2) : real;
}

/** Returns SVG inner elements based on glass type.
 *  sm = viewBox 0 0 24 24, md = viewBox 0 0 100 100, lg = viewBox 0 0 48 48
 */
type GlassSvgSize = "sm" | "md" | "lg";
type GlassVariant = "comum" | "temperado" | "laminado" | "temperado-laminado" | "insulado";

function getGlassVariant(tipo: string): GlassVariant {
  const t = tipo.toLowerCase();
  if (t.includes("temperado") && t.includes("laminado")) return "temperado-laminado";
  if (t.includes("insulado")) return "insulado";
  if (t.includes("laminado")) return "laminado";
  if (t.includes("temperado")) return "temperado";
  return "comum";
}

function getGlassSvgElements(tipo: string, size: GlassSvgSize = "md") {
  const variant = getGlassVariant(tipo);

  const c = size === "sm"
    ? { fx: 2.5, fy: 2.5, fw: 19, fh: 19, ix: 4.5, iy: 4.5, iw: 15, ih: 15, stroke: 1.3, thin: 0.9, panel: 1.6, rail: 1.15, handle: 0.85, dot: 0.7, arc: 3.5, radius: 1.1 }
    : size === "lg"
    ? { fx: 4, fy: 4, fw: 40, fh: 40, ix: 8, iy: 8, iw: 32, ih: 32, stroke: 2.2, thin: 1.4, panel: 3, rail: 2.2, handle: 1.8, dot: 1.25, arc: 8, radius: 2 }
    : { fx: 10, fy: 10, fw: 80, fh: 80, ix: 18, iy: 18, iw: 64, ih: 64, stroke: 3, thin: 1.9, panel: 6, rail: 4, handle: 3.2, dot: 2.2, arc: 16, radius: 4 };

  const right = c.ix + c.iw;
  const bottom = c.iy + c.ih;
  const midX = c.ix + c.iw / 2;
  const midY = c.iy + c.ih / 2;
  const leftPaneX = c.ix + c.panel;
  const rightPaneX = midX - c.panel * 0.35;
  const paneY = c.iy + c.panel;
  const paneH = c.ih - c.panel * 2;
  const paneW = c.iw / 2 + c.panel * 0.35;
  const innerX = c.ix + c.panel;
  const innerY = c.iy + c.panel;
  const innerW = c.iw - c.panel * 2;
  const innerH = c.ih - c.panel * 2;
  const innerRight = innerX + innerW;
  const innerBottom = innerY + innerH;
  const openLeafW = c.iw * 0.68;
  const openLeafX = c.ix + c.panel * 1.05;
  const openLeafY = c.iy + c.panel * 0.9;
  const openLeafH = c.ih - c.panel * 1.8;
  const openLeafRight = openLeafX + openLeafW;
  const openLeafBottom = openLeafY + openLeafH;
  const arcStartX = c.ix + c.panel * 1.6;
  const handleX = midX - c.handle / 2;

  const frame = (
    <>
      <rect x={c.fx} y={c.fy} width={c.fw} height={c.fh} rx={c.radius * 1.4} stroke="currentColor" strokeWidth={c.stroke} fill="none" />
      <path
        d={`M ${c.fx + c.radius} ${c.fy + c.radius * 0.6} H ${c.fx + c.radius * 3.1}
            M ${c.fx + c.radius * 0.6} ${c.fy + c.radius} V ${c.fy + c.radius * 3.1}
            M ${c.fx + c.fw - c.radius * 3.1} ${c.fy + c.radius * 0.6} H ${c.fx + c.fw - c.radius}
            M ${c.fx + c.fw - c.radius * 0.6} ${c.fy + c.radius} V ${c.fy + c.radius * 3.1}
            M ${c.fx + c.radius} ${c.fy + c.fh - c.radius * 0.6} H ${c.fx + c.radius * 3.1}
            M ${c.fx + c.radius * 0.6} ${c.fy + c.fh - c.radius} V ${c.fy + c.fh - c.radius * 3.1}
            M ${c.fx + c.fw - c.radius * 3.1} ${c.fy + c.fh - c.radius * 0.6} H ${c.fx + c.fw - c.radius}
            M ${c.fx + c.fw - c.radius * 0.6} ${c.fy + c.fh - c.radius} V ${c.fy + c.fh - c.radius * 3.1}`}
        stroke="currentColor"
        strokeWidth={c.thin}
        opacity="0.35"
        strokeLinecap="round"
      />
      <line x1={c.ix} y1={c.iy + c.rail} x2={right} y2={c.iy + c.rail} stroke="currentColor" strokeWidth={c.thin} opacity="0.22" />
      <line x1={c.ix} y1={bottom - c.rail} x2={right} y2={bottom - c.rail} stroke="currentColor" strokeWidth={c.thin} opacity="0.22" />
    </>
  );

  if (variant === "temperado") {
    return (
      <>
        {frame}
        <rect x={innerX} y={innerY} width={innerW} height={innerH} rx={c.radius} fill="currentColor" opacity="0.08" />
        <rect x={innerX} y={innerY} width={innerW} height={innerH} rx={c.radius} stroke="currentColor" strokeWidth={c.thin} opacity="0.42" />
        <line x1={innerX + c.panel * 0.6} y1={innerBottom - c.panel * 0.6} x2={innerRight - c.panel * 0.6} y2={innerY + c.panel * 0.6} stroke="currentColor" strokeWidth={c.thin} opacity="0.28" />
        <line x1={innerX + c.panel * 0.6} y1={innerY + c.panel * 0.6} x2={innerRight - c.panel * 0.6} y2={innerBottom - c.panel * 0.6} stroke="currentColor" strokeWidth={c.thin} opacity="0.18" />
        {[
          [innerX + c.panel * 0.65, innerY + c.panel * 0.65],
          [innerRight - c.panel * 0.65, innerY + c.panel * 0.65],
          [innerX + c.panel * 0.65, innerBottom - c.panel * 0.65],
          [innerRight - c.panel * 0.65, innerBottom - c.panel * 0.65],
        ].map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r={c.dot} fill="currentColor" opacity="0.55" />
        ))}
      </>
    );
  }

  if (variant === "insulado") {
    return (
      <>
        {frame}
        <rect x={innerX - c.panel * 0.35} y={innerY - c.panel * 0.35} width={innerW} height={innerH} rx={c.radius} fill="currentColor" opacity="0.05" />
        <rect x={innerX + c.panel * 0.55} y={innerY + c.panel * 0.55} width={innerW - c.panel * 1.1} height={innerH - c.panel * 1.1} rx={c.radius} fill="currentColor" opacity="0.12" />
        <rect x={innerX - c.panel * 0.35} y={innerY - c.panel * 0.35} width={innerW} height={innerH} rx={c.radius} stroke="currentColor" strokeWidth={c.thin} opacity="0.28" />
        <rect x={innerX + c.panel * 0.55} y={innerY + c.panel * 0.55} width={innerW - c.panel * 1.1} height={innerH - c.panel * 1.1} rx={c.radius} stroke="currentColor" strokeWidth={c.thin} opacity="0.45" />
        <line x1={midX - c.panel * 0.7} y1={innerY} x2={midX - c.panel * 0.7} y2={innerBottom} stroke="currentColor" strokeWidth={c.thin} opacity="0.25" strokeDasharray={size === "sm" ? "1 1" : "3 3"} />
        <line x1={midX + c.panel * 0.7} y1={innerY + c.panel * 0.2} x2={midX + c.panel * 0.7} y2={innerBottom - c.panel * 0.2} stroke="currentColor" strokeWidth={c.thin} opacity="0.25" strokeDasharray={size === "sm" ? "1 1" : "3 3"} />
      </>
    );
  }

  if (variant === "laminado" || variant === "temperado-laminado") {
    return (
      <>
        {frame}
        <rect x={openLeafX} y={openLeafY} width={openLeafW} height={openLeafH} rx={c.radius} fill="currentColor" opacity="0.08" />
        <rect x={openLeafX} y={openLeafY} width={openLeafW} height={openLeafH} rx={c.radius} stroke="currentColor" strokeWidth={c.thin} opacity="0.45" />
        <line x1={openLeafX} y1={openLeafY} x2={openLeafX} y2={openLeafBottom} stroke="currentColor" strokeWidth={c.stroke * 0.7} opacity="0.55" />
        <circle cx={openLeafX} cy={openLeafY + openLeafH * 0.22} r={c.dot} fill="currentColor" opacity="0.6" />
        <circle cx={openLeafX} cy={openLeafY + openLeafH * 0.78} r={c.dot} fill="currentColor" opacity="0.6" />
        <path d={`M ${arcStartX} ${midY - c.arc} A ${c.arc} ${c.arc} 0 0 1 ${arcStartX} ${midY + c.arc}`} stroke="currentColor" strokeWidth={c.thin} fill="none" opacity="0.35" />
        <path d={`M ${arcStartX + c.thin} ${midY - c.arc} l ${c.panel * 1.35} ${c.panel * 0.72} l ${-c.panel * 0.2} ${c.panel * 0.95}`} stroke="currentColor" strokeWidth={c.thin} fill="none" opacity="0.35" strokeLinecap="round" strokeLinejoin="round" />
        {variant === "temperado-laminado" && (
          <line x1={openLeafX + c.panel * 1.2} y1={openLeafY + c.panel * 1.1} x2={openLeafRight - c.panel * 1.1} y2={openLeafBottom - c.panel * 1.1} stroke="currentColor" strokeWidth={c.thin} opacity="0.22" />
        )}
      </>
    );
  }

  return (
    <>
      {frame}
      <rect x={leftPaneX} y={paneY} width={paneW - c.panel} height={paneH} rx={c.radius} fill="currentColor" opacity="0.08" />
      <rect x={leftPaneX} y={paneY} width={paneW - c.panel} height={paneH} rx={c.radius} stroke="currentColor" strokeWidth={c.thin} opacity="0.36" />
      <rect x={rightPaneX} y={paneY + c.panel * 0.35} width={paneW - c.panel} height={paneH - c.panel * 0.7} rx={c.radius} fill="currentColor" opacity="0.14" />
      <rect x={rightPaneX} y={paneY + c.panel * 0.35} width={paneW - c.panel} height={paneH - c.panel * 0.7} rx={c.radius} stroke="currentColor" strokeWidth={c.thin} opacity="0.45" />
      <line x1={midX} y1={c.iy} x2={midX} y2={bottom} stroke="currentColor" strokeWidth={c.thin} opacity="0.24" />
      <rect x={handleX - c.panel * 0.9} y={midY - c.panel * 0.75} width={c.handle} height={c.panel * 1.5} rx={c.handle} fill="currentColor" opacity="0.6" />
      <rect x={handleX + c.panel * 0.8} y={midY - c.panel * 0.75} width={c.handle} height={c.panel * 1.5} rx={c.handle} fill="currentColor" opacity="0.32" />
    </>
  );
}

function GlassPreviewTile({ tipo }: { tipo: string }) {
  const variant = getGlassVariant(tipo);
  const SvgComponent = glassVariantToSvg[variant] ?? VidroInteiro;
  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-background sm:h-24 sm:w-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at top left, hsl(var(--primary) / 0.16), transparent 62%)" }}
      />
      <div className="pointer-events-none absolute inset-[12%] rounded-xl border border-border/40" />
      <div className="relative h-[66px] w-[66px] sm:h-[74px] sm:w-[74px]" aria-hidden="true">
        <SvgComponent />
      </div>
    </div>
  );
}


// DB helpers
async function fetchProjetos(): Promise<ProjetoVidro[]> {
  const { data: projetos, error } = await supabase
    .from("projetos_vidro")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const { data: itens, error: itensError } = await supabase
    .from("vidro_itens")
    .select("*");
  if (itensError) throw itensError;

  return (projetos || []).map((p: any) => ({
    id: p.id,
    titulo: p.titulo,
    tipo: p.tipo,
    espessura: p.espessura,
    cor: p.cor,
    precoM2: Number(p.preco_m2),
    areaMinimaM2: Number(p.area_minima_m2 ?? 0),
    criadoEm: new Date(p.created_at).toLocaleDateString("pt-BR"),
    itens: (itens || [])
      .filter((it: any) => it.projeto_id === p.id)
      .map((it: any) => ({
        id: it.id,
        descricao: it.descricao,
        larguraMm: it.largura_mm,
        alturaMm: it.altura_mm,
        quantidade: it.quantidade,
        observacao: it.observacao ?? "",
      })),
  }));
}

// ============ INLINE EDIT ROW ============
function EditableRow({
  item,
  areaMinimaM2,
  precoM2,
  onSave,
  onCancel,
}: {
  item: VidroItem;
  areaMinimaM2: number;
  precoM2: number;
  onSave: (updates: Partial<VidroItem>) => void;
  onCancel: () => void;
}) {
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

// ============ VISUAL PREVIEW ============
function VidroVisualPreview({ itens, areaMinimaM2 }: { itens: VidroItem[]; areaMinimaM2: number }) {
  if (itens.length === 0) return null;
  const maxDim = Math.max(...itens.map((it) => Math.max(it.larguraMm, it.alturaMm)), 1);
  const scale = 80 / maxDim;

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-lg">
      {itens.map((item) => {
        const w = Math.max(item.larguraMm * scale, 12);
        const h = Math.max(item.alturaMm * scale, 12);
        const isMinArea = areaMinimaM2 > 0 && calcAreaM2(item.larguraMm, item.alturaMm) < areaMinimaM2;
        return (
          <div key={item.id} className="flex flex-col items-center gap-1">
            <div
              className={`border-2 rounded-sm flex items-center justify-center text-[9px] font-mono ${isMinArea ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30" : "border-primary/40 bg-primary/5"}`}
              style={{ width: `${w}px`, height: `${h}px`, minWidth: 20, minHeight: 16 }}
              title={`${item.larguraMm}×${item.alturaMm}mm`}
            >
              {item.quantidade > 1 && <span>×{item.quantidade}</span>}
            </div>
            <span className="text-[9px] text-muted-foreground truncate max-w-[80px]">{item.descricao}</span>
          </div>
        );
      })}
    </div>
  );
}

// ============ DETAIL VIEW ============
function ProjetoDetalhe({
  projeto,
  onBack,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: {
  projeto: ProjetoVidro;
  onBack: () => void;
  onUpdate: (p: Partial<ProjetoVidro> & { id: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
  onAddItem: (projetoId: string, item: Omit<VidroItem, "id">) => Promise<void>;
  onUpdateItem: (itemId: string, updates: Partial<VidroItem>) => Promise<void>;
  onRemoveItem: (itemId: string) => Promise<void>;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [editTitulo, setEditTitulo] = useState(projeto.titulo);
  const [editTipo, setEditTipo] = useState(projeto.tipo);
  const [editEspessura, setEditEspessura] = useState(projeto.espessura);
  const [editCor, setEditCor] = useState(projeto.cor);
  const [editPrecoM2, setEditPrecoM2] = useState(projeto.precoM2);
  const [editAreaMinima, setEditAreaMinima] = useState(projeto.areaMinimaM2);

  const [itemDesc, setItemDesc] = useState("");
  const [itemLarg, setItemLarg] = useState(1000);
  const [itemAlt, setItemAlt] = useState(1000);
  const [itemQtd, setItemQtd] = useState(1);
  const [itemObs, setItemObs] = useState("");

  const [csvText, setCsvText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const areaTotal = projeto.itens.reduce(
    (sum, it) => sum + calcAreaEfetiva(it.larguraMm, it.alturaMm, projeto.areaMinimaM2) * it.quantidade, 0
  );
  const valorTotal = areaTotal * projeto.precoM2;

  const handleSaveEdit = async () => {
    if (!editTitulo) { toast.error("Informe o título"); return; }
    setSaving(true);
    try {
      await onUpdate({ id: projeto.id, titulo: editTitulo, tipo: editTipo, espessura: editEspessura, cor: editCor, precoM2: editPrecoM2, areaMinimaM2: editAreaMinima });
      setEditOpen(false);
      toast.success("Projeto atualizado!");
    } catch { toast.error("Erro ao salvar"); }
    setSaving(false);
  };

  const handleAddItem = async () => {
    if (!itemDesc) { toast.error("Informe a descrição"); return; }
    setSaving(true);
    try {
      await onAddItem(projeto.id, { descricao: itemDesc, larguraMm: itemLarg, alturaMm: itemAlt, quantidade: itemQtd, observacao: itemObs });
      setAddItemOpen(false);
      setItemDesc(""); setItemLarg(1000); setItemAlt(1000); setItemQtd(1); setItemObs("");
      toast.success("Vidro adicionado!");
    } catch { toast.error("Erro ao adicionar"); }
    setSaving(false);
  };

  const handleInlineSave = async (itemId: string, updates: Partial<VidroItem>) => {
    setSaving(true);
    try {
      await onUpdateItem(itemId, updates);
      setEditingItemId(null);
      toast.success("Item atualizado!");
    } catch { toast.error("Erro ao atualizar"); }
    setSaving(false);
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await onRemoveItem(itemId);
      toast.success("Item removido");
    } catch { toast.error("Erro ao remover"); }
  };

  // CSV Import
  const parseCSV = (text: string): Omit<VidroItem, "id">[] => {
    const lines = text.trim().split("\n").filter(Boolean);
    const items: Omit<VidroItem, "id">[] = [];
    for (const line of lines) {
      const parts = line.split(/[;,\t]/).map(s => s.trim());
      if (parts.length < 3) continue;
      const desc = parts[0];
      const larg = parseInt(parts[1]);
      const alt = parseInt(parts[2]);
      const qtd = parseInt(parts[3]) || 1;
      const obs = parts[4] || "";
      if (!desc || isNaN(larg) || isNaN(alt)) continue;
      items.push({ descricao: desc, larguraMm: larg, alturaMm: alt, quantidade: qtd, observacao: obs });
    }
    return items;
  };

  const handleImportCSV = async () => {
    const items = parseCSV(csvText);
    if (items.length === 0) { toast.error("Nenhum item válido encontrado"); return; }
    setSaving(true);
    try {
      for (const item of items) {
        await onAddItem(projeto.id, item);
      }
      setCsvOpen(false);
      setCsvText("");
      toast.success(`${items.length} vidro(s) importado(s)!`);
    } catch { toast.error("Erro ao importar"); }
    setSaving(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCsvText(ev.target?.result as string || "");
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => {
            exportProjetoVidroPDF({ ...projeto, itens: projeto.itens });
            toast.success("PDF exportado!");
          }}>
            <FileDown className="h-3.5 w-3.5" /> PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setCsvOpen(true)}>
            <Upload className="h-3.5 w-3.5" /> Importar
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={async () => { await onDuplicate(projeto.id); onBack(); }}>
            <Copy className="h-3.5 w-3.5" /> Duplicar
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditOpen(true)}>
            <Edit2 className="h-3.5 w-3.5" /> Editar
          </Button>
          <Button variant="destructive" size="sm" className="gap-2" onClick={async () => { await onDelete(projeto.id); onBack(); }}>
            <Trash2 className="h-3.5 w-3.5" /> Excluir
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Monitor className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold">{projeto.titulo}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{projeto.tipo}</Badge>
                <Badge variant="outline">{projeto.espessura}</Badge>
                <Badge variant="outline">{projeto.cor}</Badge>
                {projeto.areaMinimaM2 > 0 && (
                  <Badge variant="outline" className="text-amber-600 border-amber-300">Mín: {projeto.areaMinimaM2} m²</Badge>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Preço/m²</p>
                  <p className="font-semibold text-sm">{formatCurrency(projeto.precoM2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Área Total</p>
                  <p className="font-semibold text-sm">{areaTotal.toFixed(2)} m²</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Valor Total</p>
                  <p className="font-bold text-sm text-primary">{formatCurrency(valorTotal)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Preview */}
      <VidroVisualPreview itens={projeto.itens} areaMinimaM2={projeto.areaMinimaM2} />

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold">Vidros do Projeto</CardTitle>
          <Button size="sm" className="gap-2" onClick={() => setAddItemOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Adicionar Vidro
          </Button>
        </CardHeader>
        <CardContent>
          {projeto.itens.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nenhum vidro adicionado. Clique em "Adicionar Vidro" para começar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-center">Largura (mm)</TableHead>
                    <TableHead className="text-center">Altura (mm)</TableHead>
                    <TableHead className="text-center">Qtd</TableHead>
                    <TableHead className="text-right">Área (m²)</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projeto.itens.map((item) => {
                    if (editingItemId === item.id) {
                      return (
                        <EditableRow
                          key={item.id}
                          item={item}
                          areaMinimaM2={projeto.areaMinimaM2}
                          precoM2={projeto.precoM2}
                          onSave={(updates) => handleInlineSave(item.id, updates)}
                          onCancel={() => setEditingItemId(null)}
                        />
                      );
                    }
                    const areaReal = calcAreaM2(item.larguraMm, item.alturaMm);
                    const areaEfetiva = calcAreaEfetiva(item.larguraMm, item.alturaMm, projeto.areaMinimaM2);
                    const areaTotalItem = areaEfetiva * item.quantidade;
                    const isMinApplied = projeto.areaMinimaM2 > 0 && areaReal < projeto.areaMinimaM2;
                    return (
                      <TableRow key={item.id} className="group">
                        <TableCell>
                          <span className="font-medium">{item.descricao}</span>
                          {item.observacao && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MessageSquare className="h-3 w-3" /> {item.observacao}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-mono">{item.larguraMm}</TableCell>
                        <TableCell className="text-center font-mono">{item.alturaMm}</TableCell>
                        <TableCell className="text-center font-semibold">{item.quantidade}</TableCell>
                        <TableCell className="text-right font-mono">
                          {areaTotalItem.toFixed(2)}
                          {isMinApplied && (
                            <span className="text-[10px] text-amber-600 block">mín aplicado</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {formatCurrency(areaTotalItem * projeto.precoM2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingItemId(item.id)}>
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleRemoveItem(item.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          {projeto.itens.length > 0 && (
            <div className="flex justify-between items-center pt-3 border-t mt-3 text-sm">
              <span className="text-muted-foreground">{projeto.itens.length} vidro(s) • {areaTotal.toFixed(2)} m² total</span>
              <span className="font-bold text-primary">{formatCurrency(valorTotal)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit project dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader><DialogTitle>Editar Projeto</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Título</Label>
              <Input value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Tipo</Label>
                <Select value={editTipo} onValueChange={setEditTipo}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{tiposVidro.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Espessura</Label>
                <Select value={editEspessura} onValueChange={setEditEspessura}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{espessuras.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Cor</Label>
                <Select value={editCor} onValueChange={setEditCor}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{cores.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Preço por m²</Label>
                <Input type="number" value={editPrecoM2} onChange={(e) => setEditPrecoM2(Number(e.target.value))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Área mínima de cobrança (m²)</Label>
              <Input type="number" step="0.01" value={editAreaMinima} onChange={(e) => setEditAreaMinima(Number(e.target.value))} placeholder="0 = sem mínimo" />
              <p className="text-xs text-muted-foreground">Peças menores serão cobradas por esta área mínima</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add item dialog */}
      <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader><DialogTitle>Adicionar Vidro</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Descrição</Label>
              <Input value={itemDesc} onChange={(e) => setItemDesc(e.target.value)} placeholder="Ex: Vidro sala de estar" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Largura (mm)</Label>
                <Input type="number" value={itemLarg} onChange={(e) => setItemLarg(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Altura (mm)</Label>
                <Input type="number" value={itemAlt} onChange={(e) => setItemAlt(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Quantidade</Label>
                <Input type="number" value={itemQtd} onChange={(e) => setItemQtd(Number(e.target.value))} min={1} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Observação</Label>
              <Input value={itemObs} onChange={(e) => setItemObs(e.target.value)} placeholder="Ex: temperado com furo, cantos lapidados" />
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Área unitária:</span>
                <span className="font-mono">{calcAreaM2(itemLarg, itemAlt).toFixed(4)} m²</span>
              </div>
              {projeto.areaMinimaM2 > 0 && calcAreaM2(itemLarg, itemAlt) < projeto.areaMinimaM2 && (
                <div className="flex justify-between text-amber-600">
                  <span>Área mínima aplicada:</span>
                  <span className="font-mono">{projeto.areaMinimaM2.toFixed(2)} m²</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Área total:</span>
                <span className="font-mono font-semibold">{(calcAreaEfetiva(itemLarg, itemAlt, projeto.areaMinimaM2) * itemQtd).toFixed(4)} m²</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setAddItemOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddItem} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Import dialog */}
      <Dialog open={csvOpen} onOpenChange={setCsvOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Importar Vidros via CSV</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Formato: <code className="text-xs bg-muted px-1 rounded">Descrição;Largura(mm);Altura(mm);Qtd;Observação</code>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
                <FileSpreadsheet className="h-3.5 w-3.5" /> Selecionar arquivo
              </Button>
              <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
            </div>
            <Textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={"Vidro Sala;1200;800;2;Temperado\nVidro Banheiro;600;400;1;Jateado"}
              rows={8}
              className="font-mono text-xs"
            />
            {csvText && (
              <p className="text-xs text-muted-foreground">
                {parseCSV(csvText).length} item(ns) válido(s) encontrado(s)
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCsvOpen(false)}>Cancelar</Button>
            <Button onClick={handleImportCSV} disabled={saving || !csvText}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============ MULTI-PROJECT SUMMARY ============
function MultiProjetoSummary({ projetos, onClose }: { projetos: ProjetoVidro[]; onClose: () => void }) {
  const totalArea = projetos.reduce((sum, p) => {
    return sum + p.itens.reduce((s, it) => s + calcAreaEfetiva(it.larguraMm, it.alturaMm, p.areaMinimaM2) * it.quantidade, 0);
  }, 0);
  const totalValor = projetos.reduce((sum, p) => {
    const area = p.itens.reduce((s, it) => s + calcAreaEfetiva(it.larguraMm, it.alturaMm, p.areaMinimaM2) * it.quantidade, 0);
    return sum + area * p.precoM2;
  }, 0);
  const totalItens = projetos.reduce((s, p) => s + p.itens.length, 0);

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Resumo Multi-Projeto</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Projetos</p>
              <p className="text-xl font-bold">{projetos.length}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Área Total</p>
              <p className="text-xl font-bold">{totalArea.toFixed(2)} m²</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Valor Total</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(totalValor)}</p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead className="text-center">Itens</TableHead>
                <TableHead className="text-right">Área (m²)</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projetos.map((p) => {
                const area = p.itens.reduce((s, it) => s + calcAreaEfetiva(it.larguraMm, it.alturaMm, p.areaMinimaM2) * it.quantidade, 0);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.titulo}</TableCell>
                    <TableCell className="text-center">{p.itens.length}</TableCell>
                    <TableCell className="text-right font-mono">{area.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{formatCurrency(area * p.precoM2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center border-t pt-3 font-bold text-sm">
            <span>{totalItens} vidro(s) em {projetos.length} projeto(s)</span>
            <span className="text-primary">{formatCurrency(totalValor)}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============ MAIN VIEW ============
const ProjetoVidroPage = () => {
  const [projetos, setProjetos] = useState<ProjetoVidro[]>([]);
  const [selected, setSelected] = useState<ProjetoVidro | null>(null);
  const [search, setSearch] = useState("");
  const [novoOpen, setNovoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoTipo, setNovoTipo] = useState("Comum");
  const [novoEspessura, setNovoEspessura] = useState("6mm");
  const [novoCor, setNovoCor] = useState("Incolor");
  const [novoPrecoM2, setNovoPrecoM2] = useState(106);
  const [novoAreaMinima, setNovoAreaMinima] = useState(0);

  const load = useCallback(async () => {
    try {
      const data = await fetchProjetos();
      setProjetos(data);
    } catch { toast.error("Erro ao carregar projetos"); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = projetos.filter(
    (p) => !search || p.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!novoTitulo) { toast.error("Informe o título"); return; }
    setSaving(true);
    try {
      const { data, error } = await supabase.from("projetos_vidro").insert({
        titulo: novoTitulo,
        tipo: novoTipo,
        espessura: novoEspessura,
        cor: novoCor,
        preco_m2: novoPrecoM2,
        area_minima_m2: novoAreaMinima,
      } as any).select().single();
      if (error) throw error;
      setNovoOpen(false);
      setNovoTitulo(""); setNovoPrecoM2(106); setNovoAreaMinima(0);
      toast.success("Projeto criado!");
      await load();
      const created: ProjetoVidro = { id: data.id, titulo: data.titulo, tipo: data.tipo, espessura: data.espessura, cor: data.cor, precoM2: Number(data.preco_m2), areaMinimaM2: Number((data as any).area_minima_m2 ?? 0), itens: [], criadoEm: new Date(data.created_at).toLocaleDateString("pt-BR") };
      setSelected(created);
    } catch { toast.error("Erro ao criar projeto"); }
    setSaving(false);
  };

  const handleUpdate = async (updates: Partial<ProjetoVidro> & { id: string }) => {
    const { error } = await supabase.from("projetos_vidro").update({
      titulo: updates.titulo,
      tipo: updates.tipo,
      espessura: updates.espessura,
      cor: updates.cor,
      preco_m2: updates.precoM2,
      area_minima_m2: updates.areaMinimaM2,
    } as any).eq("id", updates.id);
    if (error) throw error;
    await load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projetos_vidro").delete().eq("id", id);
    if (error) throw error;
    toast.success("Projeto excluído");
    await load();
  };

  const handleDuplicate = async (id: string) => {
    const original = projetos.find((p) => p.id === id);
    if (!original) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.from("projetos_vidro").insert({
        titulo: `${original.titulo} (cópia)`,
        tipo: original.tipo,
        espessura: original.espessura,
        cor: original.cor,
        preco_m2: original.precoM2,
        area_minima_m2: original.areaMinimaM2,
      } as any).select().single();
      if (error) throw error;

      if (original.itens.length > 0) {
        const itensInsert = original.itens.map((it) => ({
          projeto_id: data.id,
          descricao: it.descricao,
          largura_mm: it.larguraMm,
          altura_mm: it.alturaMm,
          quantidade: it.quantidade,
          observacao: it.observacao,
        }));
        await supabase.from("vidro_itens").insert(itensInsert as any);
      }
      toast.success("Projeto duplicado!");
      await load();
    } catch { toast.error("Erro ao duplicar"); }
    setSaving(false);
  };

  const handleAddItem = async (projetoId: string, item: Omit<VidroItem, "id">) => {
    const { error } = await supabase.from("vidro_itens").insert({
      projeto_id: projetoId,
      descricao: item.descricao,
      largura_mm: item.larguraMm,
      altura_mm: item.alturaMm,
      quantidade: item.quantidade,
      observacao: item.observacao,
    } as any);
    if (error) throw error;
    await load();
  };

  const handleUpdateItem = async (itemId: string, updates: Partial<VidroItem>) => {
    const dbUpdates: any = {};
    if (updates.descricao !== undefined) dbUpdates.descricao = updates.descricao;
    if (updates.larguraMm !== undefined) dbUpdates.largura_mm = updates.larguraMm;
    if (updates.alturaMm !== undefined) dbUpdates.altura_mm = updates.alturaMm;
    if (updates.quantidade !== undefined) dbUpdates.quantidade = updates.quantidade;
    if (updates.observacao !== undefined) dbUpdates.observacao = updates.observacao;
    const { error } = await supabase.from("vidro_itens").update(dbUpdates).eq("id", itemId);
    if (error) throw error;
    await load();
  };

  const handleRemoveItem = async (itemId: string) => {
    const { error } = await supabase.from("vidro_itens").delete().eq("id", itemId);
    if (error) throw error;
    await load();
  };


  if (selected) {
    const latest = projetos.find((p) => p.id === selected.id) || selected;
    return (
      <ProjetoDetalhe
        projeto={latest}
        onBack={() => setSelected(null)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onRemoveItem={handleRemoveItem}
      />
    );
  }

  

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Projeto Vidro</h1>
          <p className="text-muted-foreground text-sm">Visualize e configure projetos de vidro</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2 w-full sm:w-auto" onClick={() => setNovoOpen(true)}>
            <Plus className="h-4 w-4" /> Novo Projeto
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar projeto..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((projeto) => {
            const areaTotal = projeto.itens.reduce(
              (sum, it) => sum + calcAreaEfetiva(it.larguraMm, it.alturaMm, projeto.areaMinimaM2) * it.quantidade, 0
            );
            const valorTotal = areaTotal * projeto.precoM2;
            

            const tipoBadgeClass = (() => {
              const t = projeto.tipo.toLowerCase();
              if (t.includes("temperado") && t.includes("laminado")) return "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700";
              if (t.includes("temperado")) return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
              if (t.includes("laminado")) return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700";
              if (t.includes("insulado")) return "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700";
              return "bg-muted text-muted-foreground";
            })();

            const corBadgeClass = (() => {
              const c = projeto.cor.toLowerCase();
              if (c.includes("fumê") || c.includes("fume")) return "bg-gray-200 text-gray-700 border-gray-300 dark:bg-gray-700/40 dark:text-gray-300 dark:border-gray-600";
              if (c.includes("verde")) return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";
              if (c.includes("bronze")) return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700";
              if (c.includes("preto")) return "bg-gray-900 text-white border-gray-700 dark:bg-gray-800 dark:text-gray-200";
              return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700";
            })();

            return (
              <Card key={projeto.id} className={`group relative overflow-hidden border-border/50 shadow-sm transition-all duration-300 ${isSelected ? "ring-2 ring-primary border-primary/50 shadow-primary/10" : "hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-lg"}`}>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleSelect(projeto.id)}
                  className="absolute right-4 top-4 z-10 bg-background/90"
                />

                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2.5 pr-8">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary" aria-hidden="true">
                            {getGlassSvgElements(projeto.tipo, "sm")}
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="truncate text-base font-bold leading-tight">{projeto.titulo}</CardTitle>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">{projeto.criadoEm} · {projeto.itens.length} vidro{projeto.itens.length !== 1 ? "s" : ""}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 font-medium border ${tipoBadgeClass}`}>{projeto.tipo}</Badge>
                        <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-medium">{projeto.espessura}</Badge>
                        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 font-medium border ${corBadgeClass}`}>{projeto.cor}</Badge>
                      </div>

                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Área total</span>
                          <span className="font-semibold">{areaTotal.toFixed(2)} m²</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-border/50 pt-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</span>
                          <span className="text-base font-extrabold text-primary">{formatCurrency(valorTotal)}</span>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="mt-4 w-full gap-2 transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground" onClick={() => setSelected(projeto)}>
                        <Eye className="h-3.5 w-3.5" /> Ver detalhes
                      </Button>
                    </div>

                    <div className="hidden sm:block">
                      <GlassPreviewTile tipo={projeto.tipo} />
                    </div>
                  </div>

                  <div className="mt-4 sm:hidden">
                    <GlassPreviewTile tipo={projeto.tipo} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5 mb-5">
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none" className="text-primary/40">
              {getGlassSvgElements("Comum", "lg")}
            </svg>
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">Nenhum projeto encontrado</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-5">
            {search ? "Tente buscar com outros termos." : "Crie seu primeiro projeto de vidro para começar."}
          </p>
          {!search && (
            <Button className="gap-2" onClick={() => setNovoOpen(true)}>
              <Plus className="h-4 w-4" /> Novo Projeto
            </Button>
          )}
        </div>
      )}

      {showSummary && selectedProjetos.length >= 2 && (
        <MultiProjetoSummary projetos={selectedProjetos} onClose={() => setShowSummary(false)} />
      )}

      {/* New project dialog */}
      <Dialog open={novoOpen} onOpenChange={setNovoOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader><DialogTitle className="text-lg">Novo Projeto de Vidro</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Título</Label>
              <Input value={novoTitulo} onChange={(e) => setNovoTitulo(e.target.value)} placeholder="Ex: Vidro 8mm Temperado - Fumê" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Tipo</Label>
                <Select value={novoTipo} onValueChange={setNovoTipo}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{tiposVidro.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Espessura</Label>
                <Select value={novoEspessura} onValueChange={setNovoEspessura}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{espessuras.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Cor</Label>
                <Select value={novoCor} onValueChange={setNovoCor}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{cores.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Preço por m²</Label>
                <Input type="number" value={novoPrecoM2} onChange={(e) => setNovoPrecoM2(Number(e.target.value))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Área mínima (m²)</Label>
              <Input type="number" step="0.01" value={novoAreaMinima} onChange={(e) => setNovoAreaMinima(Number(e.target.value))} placeholder="0 = sem mínimo" />
              <p className="text-xs text-muted-foreground">Peças menores serão cobradas por esta área mínima</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setNovoOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Criar Projeto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjetoVidroPage;
