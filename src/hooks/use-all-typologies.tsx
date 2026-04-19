import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { typologies as catalogTypologies } from "@/data/catalog/typologies";
import type { Typology } from "@/types/calculation";

export function findBaseTypologyId(
  custom: Pick<Typology, "product_line_id" | "category" | "subcategory" | "num_folhas">,
): string | null {
  const sameLine = catalogTypologies.filter(
    (t) => t.product_line_id === custom.product_line_id && t.active,
  );

  const exact = sameLine.find(
    (t) =>
      t.category === custom.category &&
      t.subcategory === custom.subcategory &&
      t.num_folhas === custom.num_folhas,
  );
  if (exact) return exact.id;

  const catSub = sameLine.find(
    (t) => t.category === custom.category && t.subcategory === custom.subcategory,
  );
  if (catSub) return catSub.id;

  const catOnly = sameLine.find((t) => t.category === custom.category);
  if (catOnly) return catOnly.id;

  const globalExact = catalogTypologies.find(
    (t) =>
      t.active &&
      t.category === custom.category &&
      t.subcategory === custom.subcategory &&
      t.num_folhas === custom.num_folhas,
  );
  if (globalExact) return globalExact.id;

  const globalCatSub = catalogTypologies.find(
    (t) =>
      t.active &&
      t.category === custom.category &&
      t.subcategory === custom.subcategory,
  );
  if (globalCatSub) return globalCatSub.id;

  return null;
}

export type ExtendedTypology = Typology & { _baseTypologyId?: string; _isCustom?: boolean; imagem_url?: string };

export function useAllTypologies() {
  const [customTypologies, setCustomTypologies] = useState<ExtendedTypology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: err } = await supabase
          .from("tipologias_customizadas")
          .select("*")
          .eq("active", true);

        if (err) {
          // Error fetching typologies
          setError(err.message);
        } else if (data) {
          const mapped: ExtendedTypology[] = data.map((row: any) => {
            const typology: ExtendedTypology = {
              id: row.id,
              product_line_id: row.product_line_id,
              name: row.name,
              category: row.category as Typology["category"],
              subcategory: (row.subcategory ?? undefined) as Typology["subcategory"],
              num_folhas: row.num_folhas,
              has_veneziana: row.has_veneziana,
              has_bandeira: row.has_bandeira,
              notes: row.notes ?? undefined,
              active: row.active,
              min_width_mm: row.min_width_mm ?? undefined,
              max_width_mm: row.max_width_mm ?? undefined,
              min_height_mm: row.min_height_mm ?? undefined,
              max_height_mm: row.max_height_mm ?? undefined,
              _isCustom: true,
              imagem_url: row.imagem_url ?? undefined,
            };
            typology._baseTypologyId = findBaseTypologyId(typology) ?? undefined;
            return typology;
          });
          setCustomTypologies(mapped);
        }
      } catch (e) {
        // Unexpected error
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const allTypologies: ExtendedTypology[] = useMemo(() => {
    const catalog: ExtendedTypology[] = catalogTypologies.map((t) => ({
      ...t,
      _isCustom: false,
    }));
    return [...catalog, ...customTypologies];
  }, [customTypologies]);

  return { allTypologies, customTypologies, loading, error };
}
