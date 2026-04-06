import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { typologies as catalogTypologies } from "@/data/catalog/typologies";
import type { Typology } from "@/types/calculation";

/**
 * Given a custom typology from DB, finds the best matching catalog typology ID
 * to inherit cut rules / glass rules / components from.
 *
 * Match priority: same product_line_id → same category+subcategory+num_folhas → category+subcategory → category
 */
export function findBaseTypologyId(
  custom: Pick<Typology, "product_line_id" | "category" | "subcategory" | "num_folhas">,
): string | null {
  // 1. Exact match in same line
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

  // 2. Try across all lines with same category+sub+folhas
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

/**
 * Hook that returns catalog typologies merged with custom (DB) typologies.
 * Each custom typology gets a `_baseTypologyId` for rule resolution.
 */
export type ExtendedTypology = Typology & { _baseTypologyId?: string; _isCustom?: boolean };

export function useAllTypologies() {
  const [customTypologies, setCustomTypologies] = useState<ExtendedTypology[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("tipologias_customizadas")
        .select("*")
        .eq("active", true);

      if (data) {
        const mapped: ExtendedTypology[] = data.map((row) => {
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
          };
          typology._baseTypologyId = findBaseTypologyId(typology) ?? undefined;
          return typology;
        });
        setCustomTypologies(mapped);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const allTypologies: ExtendedTypology[] = useMemo(() => {
    const catalog: ExtendedTypology[] = catalogTypologies.map((t) => ({
      ...t,
      _isCustom: false,
    }));
    return [...catalog, ...customTypologies];
  }, [customTypologies]);

  return { allTypologies, customTypologies, loading };
}
