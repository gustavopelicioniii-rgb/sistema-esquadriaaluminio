import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { tiposProduto } from "@/data/orcamento-produtos";
import { aluminumColors } from "@/components/frame-preview/colors";
import Frame3DWrapper from "@/components/frame-preview/Frame3DWrapper";
import PhotorealisticPreview from "@/components/frame-preview/PhotorealisticPreview";
import { FramePreview } from "@/components/frame-preview";
import { validateDimensions } from "@/data/orcamento-produtos";
import MaterialDetailDialog from "@/components/orcamento/MaterialDetailDialog";
import { getColorById } from "@/components/frame-preview/colors";

const vidroOptions = ["Comum", "Temperado", "Laminado", "Jateado", "Nenhum"];
const ferragemColors = [
  { id: "cromado", name: "Cromado", hex: "#C0C0C0" },
  { id: "preto", name: "Preto", hex: "#333333" },
  { id: "branco", name: "Branco", hex: "#F0F0F0" },
  { id: "bronze", name: "Bronze", hex: "#8B6914" },
];

export interface OrcamentoItem {
  id: string;
  tipo: string;
  largura: number;
  altura: number;
  quantidade: number;
  colorId: string;
  ferragemColorId: string;
  vidroTipo: string;
  ambiente: string;
}

interface ItensStepProps {
  items: OrcamentoItem[];
  activeItemIdx: number;
  onActiveItemChange: (idx: number) => void;
  onItemUpdate: (idx: number, updates: Partial<OrcamentoItem>) => void;
  onAddItem: () => void;
  onRemoveItem: (idx: number) => void;
}

export function ItensStep({
  items,
  activeItemIdx,
  onActiveItemChange,
  onItemUpdate,
  onAddItem,
  onRemoveItem,
}: ItensStepProps) {
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const activeItem = items[activeItemIdx];
  const produtoSelecionado = tiposProduto.find((t) => t.value === activeItem?.tipo);

  return (
    <div className="flex h-full">
      {/* Left sidebar - Items list */}
      <div className="w-[260px] shrink-0 border-r bg-muted/30 p-3 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Itens ({items.length})</p>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddItem}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
          {items.map((item, idx) => {
            const prod = tiposProduto.find(t => t.value === item.tipo);
            return (
              <button
                key={item.id}
                onClick={() => onActiveItemChange(idx)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors text-xs",
                  activeItemIdx === idx ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50"
                )}
              >
                <div className="w-8 h-8 bg-muted/40 rounded flex items-center justify-center shrink-0">
                  <FramePreview
                    width_mm={item.largura * 10}
                    height_mm={item.altura * 10}
                    category={prod?.category ?? "janela_correr"}
                    subcategory={prod?.subcategory ?? "2_folhas"}
                    num_folhas={prod?.numFolhas ?? 2}
                    has_veneziana={prod?.veneziana}
                    colorId={item.colorId}
                    maxWidth={24}
                    maxHeight={24}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{prod?.label ?? "Item"}</p>
                  <p className="text-muted-foreground text-[10px]">{item.largura * 10}×{item.altura * 10}mm</p>
                </div>
                {items.length > 1 && (
                  <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0 text-destructive/60 hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); onRemoveItem(idx); }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </button>
            );
          })}
        </div>
        <Button variant="outline" className="w-full gap-1 text-xs" onClick={onAddItem}>
          <Plus className="h-3 w-3" /> Adicionar item
        </Button>
        {produtoSelecionado && (
          <button
            onClick={() => setMaterialDialogOpen(true)}
            className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
          >
            <List className="h-3 w-3" /> Ver materiais
          </button>
        )}
      </div>

      {/* Right - Item form */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto p-6 space-y-6">
          <div className="space-y-2">
            <Label>Tipo de Produto</Label>
            <Select value={activeItem.tipo} onValueChange={(v) => onItemUpdate(activeItemIdx, { tipo: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {tiposProduto.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center bg-muted/30 rounded-lg p-4">
            <Frame3DWrapper className="flex items-center justify-center">
              <PhotorealisticPreview
                imagemUrl={produtoSelecionado?.imagem_url}
                width_mm={activeItem.largura * 10}
                height_mm={activeItem.altura * 10}
                category={produtoSelecionado?.category ?? "janela_correr"}
                subcategory={produtoSelecionado?.subcategory ?? "2_folhas"}
                num_folhas={produtoSelecionado?.numFolhas ?? 2}
                has_veneziana={produtoSelecionado?.veneziana}
                colorId={activeItem.colorId}
                maxWidth={380}
                maxHeight={300}
              />
            </Frame3DWrapper>
          </div>

          {/* Dimensões */}
          {(() => {
            const dimErrors = validateDimensions(activeItem.tipo, activeItem.largura, activeItem.altura);
            const prod = produtoSelecionado;
            return (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Largura (cm)</Label>
                  <Input type="number" value={activeItem.largura}
                    onChange={(e) => onItemUpdate(activeItemIdx, { largura: Number(e.target.value) })}
                    className={cn(dimErrors?.largura && "border-destructive")} />
                  {dimErrors?.largura ? (
                    <p className="text-[11px] font-medium text-destructive">{dimErrors.largura}</p>
                  ) : prod && (
                    <p className="text-[10px] text-muted-foreground">{prod.minLarguraCm}–{prod.maxLarguraCm} cm</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Altura (cm)</Label>
                  <Input type="number" value={activeItem.altura}
                    onChange={(e) => onItemUpdate(activeItemIdx, { altura: Number(e.target.value) })}
                    className={cn(dimErrors?.altura && "border-destructive")} />
                  {dimErrors?.altura ? (
                    <p className="text-[11px] font-medium text-destructive">{dimErrors.altura}</p>
                  ) : prod && (
                    <p className="text-[10px] text-muted-foreground">{prod.minAlturaCm}–{prod.maxAlturaCm} cm</p>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Quantidade */}
          <div className="space-y-2">
            <Label>Quantidade</Label>
            <div className="flex items-center gap-0">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-r-none"
                onClick={() => onItemUpdate(activeItemIdx, { quantidade: Math.max(1, activeItem.quantidade - 1) })}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input type="number" value={activeItem.quantidade}
                onChange={(e) => onItemUpdate(activeItemIdx, { quantidade: Math.max(1, Number(e.target.value)) })}
                className="rounded-none text-center border-x-0 h-8" min={1} />
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-none"
                onClick={() => onItemUpdate(activeItemIdx, { quantidade: activeItem.quantidade + 1 })}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Vidro */}
          <div className="space-y-2">
            <Label>Tipo de vidro</Label>
            <div className="flex flex-wrap gap-2">
              {vidroOptions.map((v) => (
                <button key={v} onClick={() => onItemUpdate(activeItemIdx, { vidroTipo: v })}
                  className={cn("px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                    activeItem.vidroTipo === v ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border")}>
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Cor alumínio */}
          <div className="space-y-2">
            <Label>Cor dos alumínios</Label>
            <div className="flex flex-wrap gap-2">
              {aluminumColors.map((c) => (
                <button key={c.id} onClick={() => onItemUpdate(activeItemIdx, { colorId: c.id })}
                  className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                    activeItem.colorId === c.id ? "border-primary bg-primary/10" : "border-border bg-muted/30")}>
                  <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cor ferragem */}
          <div className="space-y-2">
            <Label>Cor das ferragens</Label>
            <div className="flex flex-wrap gap-2">
              {ferragemColors.map((c) => (
                <button key={c.id} onClick={() => onItemUpdate(activeItemIdx, { ferragemColorId: c.id })}
                  className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                    activeItem.ferragemColorId === c.id ? "border-primary bg-primary/10" : "border-border bg-muted/30")}>
                  <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Ambiente */}
          <div className="space-y-2">
            <Label>Ambiente (opcional)</Label>
            <Input placeholder="Ex: Sala, Quarto..." value={activeItem.ambiente}
              onChange={(e) => onItemUpdate(activeItemIdx, { ambiente: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Material Dialog */}
      {produtoSelecionado && (
        <MaterialDetailDialog
          open={materialDialogOpen}
          onOpenChange={setMaterialDialogOpen}
          typologyId={produtoSelecionado.typologyId}
          larguraCm={activeItem.largura}
          alturaCm={activeItem.altura}
          quantidade={activeItem.quantidade}
          colorName={getColorById(activeItem.colorId).name}
          colorHex={getColorById(activeItem.colorId).hex}
        />
      )}
    </div>
  );
}
