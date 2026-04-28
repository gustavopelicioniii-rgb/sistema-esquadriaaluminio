import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { value: 'janela', label: 'Janela' },
  { value: 'porta', label: 'Porta' },
  { value: 'vitro', label: 'Vitrô' },
  { value: 'veneziana', label: 'Veneziana' },
  { value: 'maxim_ar', label: 'Maxim-Ar' },
  { value: 'camarao', label: 'Camarão' },
  { value: 'pivotante', label: 'Pivotante' },
  { value: 'basculante', label: 'Basculante' },
  { value: 'fachada', label: 'Fachada' },
];

const SUBCATEGORIES = [
  { value: 'correr', label: 'Correr' },
  { value: 'giro', label: 'Giro' },
  { value: 'maxim_ar', label: 'Maxim-Ar' },
  { value: 'camarao', label: 'Camarão' },
  { value: 'basculante', label: 'Basculante' },
  { value: 'pivotante', label: 'Pivotante' },
  { value: 'fixo', label: 'Fixo' },
];

interface Props {
  filterCategory: string | null;
  filterSubcategory: string | null;
  filterFolhas: number | null;
  filterVeneziana: boolean | null;
  filterBandeira: boolean | null;
  uniqueCategories: string[];
  uniqueSubcategories: (string | null)[];
  uniqueFolhas: number[];
  onFilterCategory: (v: string | null) => void;
  onFilterSubcategory: (v: string | null) => void;
  onFilterFolhas: (v: number | null) => void;
  onFilterVeneziana: (v: boolean | null) => void;
  onFilterBandeira: (v: boolean | null) => void;
  onClearAll: () => void;
  totalCount: number;
  filteredCount: number;
}

export function TypologyFilters({
  filterCategory,
  filterSubcategory,
  filterFolhas,
  filterVeneziana,
  filterBandeira,
  uniqueCategories,
  uniqueSubcategories,
  uniqueFolhas,
  onFilterCategory,
  onFilterSubcategory,
  onFilterFolhas,
  onFilterVeneziana,
  onFilterBandeira,
  onClearAll,
  totalCount,
  filteredCount,
}: Props) {
  const hasFilters = !!(
    filterCategory ||
    filterSubcategory ||
    filterFolhas ||
    filterVeneziana !== null ||
    filterBandeira !== null
  );

  const getCategoryLabel = (cat: string) => CATEGORIES.find(c => c.value === cat)?.label || cat;

  return (
    <div className="hidden md:block w-52 shrink-0">
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4 pr-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase text-muted-foreground">Filtros</h4>
            {hasFilters && (
              <button onClick={onClearAll} className="text-[10px] text-primary hover:underline">
                Limpar
              </button>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Tipologia</h4>
            <div className="space-y-0.5">
              {uniqueCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => onFilterCategory(filterCategory === cat ? null : cat)}
                  className={cn(
                    'block w-full text-left text-sm px-2 py-1 rounded-md transition-colors',
                    filterCategory === cat
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground/70 hover:bg-muted'
                  )}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">
              Sistema de Abertura
            </h4>
            <div className="space-y-0.5">
              {uniqueSubcategories.filter(Boolean).map(sub => (
                <button
                  key={sub}
                  onClick={() => onFilterSubcategory(filterSubcategory === sub ? null : sub)}
                  className={cn(
                    'block w-full text-left text-sm px-2 py-1 rounded-md transition-colors',
                    filterSubcategory === sub
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground/70 hover:bg-muted'
                  )}
                >
                  {SUBCATEGORIES.find(s => s.value === sub)?.label || sub}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">
              Quantidade de Folhas
            </h4>
            <div className="space-y-0.5">
              {uniqueFolhas.map(n => (
                <button
                  key={n}
                  onClick={() => onFilterFolhas(filterFolhas === n ? null : n)}
                  className={cn(
                    'block w-full text-left text-sm px-2 py-1 rounded-md transition-colors',
                    filterFolhas === n
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground/70 hover:bg-muted'
                  )}
                >
                  {n} Folha{n !== 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Extras</h4>
            <div className="space-y-0.5">
              <button
                onClick={() => onFilterVeneziana(filterVeneziana === true ? null : true)}
                className={cn(
                  'block w-full text-left text-sm px-2 py-1 rounded-md transition-colors',
                  filterVeneziana === true
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground/70 hover:bg-muted'
                )}
              >
                Com Veneziana
              </button>
              <button
                onClick={() => onFilterVeneziana(filterVeneziana === false ? null : false)}
                className={cn(
                  'block w-full text-left text-sm px-2 py-1 rounded-md transition-colors',
                  filterVeneziana === false
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground/70 hover:bg-muted'
                )}
              >
                Sem Veneziana
              </button>
              <button
                onClick={() => onFilterBandeira(filterBandeira === true ? null : true)}
                className={cn(
                  'block w-full text-left text-sm px-2 py-1 rounded-md transition-colors',
                  filterBandeira === true
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground/70 hover:bg-muted'
                )}
              >
                Com Bandeira
              </button>
              <button
                onClick={() => onFilterBandeira(filterBandeira === false ? null : false)}
                className={cn(
                  'block w-full text-left text-sm px-2 py-1 rounded-md transition-colors',
                  filterBandeira === false
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground/70 hover:bg-muted'
                )}
              >
                Sem Bandeira
              </button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
