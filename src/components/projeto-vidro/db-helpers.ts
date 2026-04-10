import { supabase } from "@/integrations/supabase/client";
import { ProjetoVidro } from "./types";

export async function fetchProjetos(): Promise<ProjetoVidro[]> {
  const { data: projetos, error } = await supabase
    .from("projetos_vidro")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!projetos || projetos.length === 0) return [];

  const projetoIds = projetos.map((p: any) => p.id);
  const { data: itens, error: itensError } = await supabase
    .from("vidro_itens")
    .select("*")
    .in("projeto_id", projetoIds);
  if (itensError) throw itensError;

  const itensByProjeto = new Map<string, any[]>();
  for (const it of itens || []) {
    const list = itensByProjeto.get(it.projeto_id) || [];
    list.push(it);
    itensByProjeto.set(it.projeto_id, list);
  }

  return projetos.map((p: any) => ({
    id: p.id,
    titulo: p.titulo,
    tipo: p.tipo,
    espessura: p.espessura,
    cor: p.cor,
    precoM2: Number(p.preco_m2),
    areaMinimaM2: Number(p.area_minima_m2 ?? 0),
    criadoEm: new Date(p.created_at).toLocaleDateString("pt-BR"),
    itens: (itensByProjeto.get(p.id) || []).map((it: any) => ({
      id: it.id,
      descricao: it.descricao,
      larguraMm: it.largura_mm,
      alturaMm: it.altura_mm,
      quantidade: it.quantidade,
      observacao: it.observacao ?? "",
    })),
  }));
}
