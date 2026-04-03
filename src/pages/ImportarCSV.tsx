import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Loader2, X, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";

type ImportMode = "perfis" | "estoque";

interface ParsedRow {
  [key: string]: string;
}

interface ImportResult {
  created: number;
  updated: number;
  errors: string[];
}

const PERFIL_REQUIRED = ["codigo", "nome"];
const ESTOQUE_REQUIRED = ["codigo", "produto"];

const PERFIL_COLUMNS_MAP: Record<string, string> = {
  codigo: "Código",
  nome: "Nome",
  tipo: "Tipo",
  peso_metro: "Peso/metro (kg)",
  comprimento_barra: "Comprimento barra (mm)",
  material: "Material",
  linha: "Linha",
};

const ESTOQUE_COLUMNS_MAP: Record<string, string> = {
  codigo: "Código",
  produto: "Produto",
  quantidade: "Quantidade",
  unidade: "Unidade",
  categoria: "Categoria",
  minimo: "Mínimo",
};

function normalizeHeader(h: string): string {
  return h
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

/** Sinônimos para auto-mapeamento de colunas CSV */
const COLUMN_SYNONYMS: Record<string, string[]> = {
  // Estoque
  codigo: ["codigo", "cod", "code", "sku", "ref", "referencia", "id", "item"],
  produto: ["produto", "nome", "name", "descricao", "description", "material", "item", "peca"],
  quantidade: ["quantidade", "qtd", "qty", "qtde", "quant", "estoque", "saldo"],
  unidade: ["unidade", "un", "unit", "und", "medida"],
  categoria: ["categoria", "cat", "category", "tipo", "type", "grupo", "group", "classe"],
  minimo: ["minimo", "min", "minimum", "estoque_minimo", "qtd_minima", "ponto_reposicao"],
  // Perfis
  nome: ["nome", "name", "descricao", "description", "produto"],
  tipo: ["tipo", "type", "perfil_tipo", "profile_type"],
  peso_metro: ["peso_metro", "peso", "weight", "kg_m", "peso_kg", "peso_linear"],
  comprimento_barra: ["comprimento_barra", "comprimento", "length", "barra", "tamanho"],
  material: ["material", "mat"],
  linha: ["linha", "line", "serie", "familia"],
};

function findBestMatch(headers: string[], targetKey: string): string | null {
  const synonyms = COLUMN_SYNONYMS[targetKey] || [targetKey];
  const normalizedHeaders = headers.map(h => ({ original: h, normalized: normalizeHeader(h) }));

  // 1. Exact match on normalized header
  for (const syn of synonyms) {
    const match = normalizedHeaders.find(h => h.normalized === syn);
    if (match) return match.original;
  }

  // 2. Header contains synonym or synonym contains header
  for (const syn of synonyms) {
    const match = normalizedHeaders.find(h => h.normalized.includes(syn) || syn.includes(h.normalized));
    if (match) return match.original;
  }

  return null;
}

const ImportarCSV = () => {
  const [mode, setMode] = useState<ImportMode>("estoque");
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [step, setStep] = useState<"upload" | "map" | "preview" | "done">("upload");

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: (res) => {
        if (res.errors.length > 0 && res.data.length === 0) {
          toast.error("Erro ao ler o CSV");
          return;
        }
        const data = res.data as ParsedRow[];
        const hdrs = res.meta.fields || [];
        setHeaders(hdrs);
        setRows(data);

        // Auto-map columns
        const targetCols = mode === "estoque" ? Object.keys(ESTOQUE_COLUMNS_MAP) : Object.keys(PERFIL_COLUMNS_MAP);
        const autoMap: Record<string, string> = {};
        for (const target of targetCols) {
          const match = hdrs.find(h => normalizeHeader(h) === target || normalizeHeader(h).includes(target));
          if (match) autoMap[target] = match;
        }
        setColumnMap(autoMap);
        setStep("map");
      },
    });
  }, [mode]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith(".csv") || f.type === "text/csv")) handleFile(f);
    else toast.error("Selecione um arquivo .csv");
  }, [handleFile]);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const requiredCols = mode === "estoque" ? ESTOQUE_REQUIRED : PERFIL_REQUIRED;
  const allRequired = requiredCols.every(c => columnMap[c]);

  const handleImport = async () => {
    setImporting(true);
    const res: ImportResult = { created: 0, updated: 0, errors: [] };

    try {
      if (mode === "estoque") {
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const codigo = columnMap.codigo ? row[columnMap.codigo]?.trim() : "";
          const produto = columnMap.produto ? row[columnMap.produto]?.trim() : "";
          if (!codigo || !produto) { res.errors.push(`Linha ${i + 2}: código ou produto vazio`); continue; }

          const quantidade = columnMap.quantidade ? parseInt(row[columnMap.quantidade]) || 0 : 0;
          const unidade = columnMap.unidade ? row[columnMap.unidade]?.trim() || "pçs" : "pçs";
          const categoria = columnMap.categoria ? row[columnMap.categoria]?.trim() || "Outros" : "Outros";
          const minimo = columnMap.minimo ? parseInt(row[columnMap.minimo]) || 0 : 0;

          // Check if exists
          const { data: existing } = await supabase
            .from("estoque")
            .select("id")
            .eq("codigo", codigo)
            .maybeSingle();

          if (existing) {
            const { error } = await supabase.from("estoque").update({ produto, quantidade, unidade, categoria, minimo }).eq("id", existing.id);
            if (error) { res.errors.push(`Linha ${i + 2}: ${error.message}`); continue; }
            res.updated++;
          } else {
            const { error } = await supabase.from("estoque").insert({ codigo, produto, quantidade, unidade, categoria, minimo });
            if (error) { res.errors.push(`Linha ${i + 2}: ${error.message}`); continue; }
            res.created++;
          }
        }
      } else {
        // Perfis — insert into estoque as well with categoria "Perfil"
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const codigo = columnMap.codigo ? row[columnMap.codigo]?.trim() : "";
          const nome = columnMap.nome ? row[columnMap.nome]?.trim() : "";
          if (!codigo || !nome) { res.errors.push(`Linha ${i + 2}: código ou nome vazio`); continue; }

          const peso = columnMap.peso_metro ? row[columnMap.peso_metro]?.trim() : "";
          const linha = columnMap.linha ? row[columnMap.linha]?.trim() : "";
          const produto = `${nome}${linha ? ` (${linha})` : ""}${peso ? ` - ${peso} kg/m` : ""}`;

          const { data: existing } = await supabase
            .from("estoque")
            .select("id")
            .eq("codigo", codigo)
            .maybeSingle();

          if (existing) {
            const { error } = await supabase.from("estoque").update({ produto, categoria: "Perfil" }).eq("id", existing.id);
            if (error) { res.errors.push(`Linha ${i + 2}: ${error.message}`); continue; }
            res.updated++;
          } else {
            const { error } = await supabase.from("estoque").insert({ codigo, produto, categoria: "Perfil", quantidade: 0, unidade: "br" });
            if (error) { res.errors.push(`Linha ${i + 2}: ${error.message}`); continue; }
            res.created++;
          }
        }
      }

      setResult(res);
      setStep("done");
      if (res.errors.length === 0) toast.success(`Importação concluída! ${res.created} criados, ${res.updated} atualizados.`);
      else toast.warning(`Importação com ${res.errors.length} aviso(s)`);
    } catch (err: any) {
      toast.error("Erro na importação: " + (err?.message || "desconhecido"));
    }
    setImporting(false);
  };

  const reset = () => {
    setFile(null); setRows([]); setHeaders([]); setColumnMap({}); setResult(null); setStep("upload");
  };

  const colsMap = mode === "estoque" ? ESTOQUE_COLUMNS_MAP : PERFIL_COLUMNS_MAP;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Importar CSV</h1>
          <p className="text-muted-foreground text-sm">Importe dados de fornecedores para sincronizar com o sistema</p>
        </div>
        <Select value={mode} onValueChange={(v) => { setMode(v as ImportMode); reset(); }}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="estoque">Peças / Estoque</SelectItem>
            <SelectItem value="perfis">Perfis de Alumínio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 text-sm">
        {["Upload", "Mapear colunas", "Pré-visualizar", "Concluído"].map((label, i) => {
          const stepIndex = ["upload", "map", "preview", "done"].indexOf(step);
          const isActive = i === stepIndex;
          const isDone = i < stepIndex;
          return (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
              <Badge variant={isActive ? "default" : isDone ? "secondary" : "outline"} className="text-xs">
                {isDone ? <CheckCircle2 className="h-3 w-3 mr-1" /> : null}
                {label}
              </Badge>
            </div>
          );
        })}
      </div>

      {/* Step: Upload */}
      {step === "upload" && (
        <Card>
          <CardContent className="p-8">
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("csv-input")?.click()}
            >
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="font-semibold">Arraste um arquivo CSV aqui</p>
              <p className="text-sm text-muted-foreground mt-1">ou clique para selecionar</p>
              <input id="csv-input" type="file" accept=".csv" className="hidden" onChange={onFileInput} />
            </div>

            <Separator className="my-6" />

            <div className="text-sm text-muted-foreground space-y-4">
              <p className="font-medium text-foreground mb-2">Colunas esperadas ({mode === "estoque" ? "Estoque" : "Perfis"}):</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(colsMap).map(([key, label]) => (
                  <Badge key={key} variant={requiredCols.includes(key) ? "default" : "outline"} className="text-xs">
                    {label} {requiredCols.includes(key) && "*"}
                  </Badge>
                ))}
              </div>
               <p className="text-xs">* Campos obrigatórios</p>
               <Button
                 variant="outline"
                 size="sm"
                 className="mt-2 gap-2"
                 onClick={() => {
                   const content = mode === "estoque"
                     ? "codigo,produto,quantidade,unidade,categoria,minimo\nALU-001,Parafuso Sextavado 5mm,500,pçs,Fixação,100\nALU-002,Feltrinho Adesivo 10mm,1200,pçs,Vedação,200"
                     : "codigo,nome,tipo,peso_metro,comprimento_barra,material,linha\nPF-001,Montante Fixo,Montante,0.52,6000,Alumínio,Suprema\nPF-002,Travessa Inferior,Travessa,0.48,6000,Alumínio,Gold";
                   const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
                   const url = URL.createObjectURL(blob);
                   const a = document.createElement("a");
                   a.href = url;
                   a.download = mode === "estoque" ? "modelo_estoque.csv" : "modelo_perfis.csv";
                   a.click();
                   URL.revokeObjectURL(url);
                 }}
               >
                 <FileSpreadsheet className="h-4 w-4" />
                 Baixar modelo CSV
               </Button>

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <p className="font-medium text-foreground text-sm">📋 Instruções de formato</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>O arquivo deve ser <strong>.csv</strong> separado por vírgula ou ponto-e-vírgula</li>
                  <li>A primeira linha deve conter os nomes das colunas (cabeçalho)</li>
                  <li>Codificação recomendada: <strong>UTF-8</strong></li>
                  <li>Campos com vírgula devem estar entre aspas duplas</li>
                  <li>Valores numéricos devem usar ponto como separador decimal (ex: 0.52)</li>
                </ul>

                <p className="font-medium text-foreground text-xs mt-3">Exemplo de CSV — {mode === "estoque" ? "Estoque" : "Perfis"}:</p>
                <pre className="bg-background rounded p-2 text-[11px] font-mono overflow-x-auto whitespace-pre">
{mode === "estoque"
  ? `codigo,produto,quantidade,unidade,categoria,minimo
ALU-001,Parafuso Sextavado 5mm,500,pçs,Fixação,100
ALU-002,Feltrinho Adesivo 10mm,1200,pçs,Vedação,200
ALU-003,Roldana Simples 20mm,80,pçs,Acessórios,20`
  : `codigo,nome,tipo,peso_metro,comprimento_barra,material,linha
PF-001,Montante Fixo,Montante,0.52,6000,Alumínio,Suprema
PF-002,Travessa Inferior,Travessa,0.48,6000,Alumínio,Gold
PF-003,Marco Lateral,Marco,0.61,6000,Alumínio,Suprema`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Map columns */}
      {step === "map" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              Mapear Colunas — {file?.name}
              <Badge variant="secondary" className="ml-auto">{rows.length} linhas</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(colsMap).map(([key, label]) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-1">
                    {label}
                    {requiredCols.includes(key) && <span className="text-destructive">*</span>}
                  </label>
                  <Select value={columnMap[key] || "__none__"} onValueChange={(v) => setColumnMap(prev => ({ ...prev, [key]: v === "__none__" ? "" : v }))}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">— Não mapear —</SelectItem>
                      {headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={reset}>Cancelar</Button>
              <Button disabled={!allRequired} onClick={() => setStep("preview")} className="gap-2">
                Pré-visualizar <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Preview */}
      {step === "preview" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pré-visualização ({rows.length} registros)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs w-10">#</TableHead>
                    {Object.entries(colsMap).filter(([key]) => columnMap[key]).map(([key, label]) => (
                      <TableHead key={key} className="text-xs">{label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.slice(0, 20).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                      {Object.entries(colsMap).filter(([key]) => columnMap[key]).map(([key]) => (
                        <TableCell key={key} className="text-xs font-mono">{row[columnMap[key]] || "—"}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {rows.length > 20 && (
              <p className="text-xs text-muted-foreground mt-2">Mostrando 20 de {rows.length} registros</p>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep("map")}>Voltar</Button>
              <Button onClick={handleImport} disabled={importing} className="gap-2">
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Importar {rows.length} registros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Done */}
      {step === "done" && result && (
        <Card>
          <CardContent className="p-8 text-center">
            {result.errors.length === 0 ? (
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            ) : (
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            )}
            <h3 className="text-lg font-bold mb-2">Importação Concluída</h3>
            <div className="flex justify-center gap-6 mb-4">
              <div>
                <p className="text-2xl font-bold text-primary">{result.created}</p>
                <p className="text-xs text-muted-foreground">Criados</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{result.updated}</p>
                <p className="text-xs text-muted-foreground">Atualizados</p>
              </div>
              {result.errors.length > 0 && (
                <div>
                  <p className="text-2xl font-bold text-destructive">{result.errors.length}</p>
                  <p className="text-xs text-muted-foreground">Erros</p>
                </div>
              )}
            </div>

            {result.errors.length > 0 && (
              <div className="mt-4 text-left max-h-40 overflow-y-auto bg-muted/50 rounded-lg p-3">
                {result.errors.slice(0, 10).map((err, i) => (
                  <p key={i} className="text-xs text-destructive flex items-start gap-1">
                    <X className="h-3 w-3 mt-0.5 shrink-0" /> {err}
                  </p>
                ))}
                {result.errors.length > 10 && (
                  <p className="text-xs text-muted-foreground mt-1">...e mais {result.errors.length - 10} erros</p>
                )}
              </div>
            )}

            <Button onClick={reset} className="mt-6">Nova Importação</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImportarCSV;
