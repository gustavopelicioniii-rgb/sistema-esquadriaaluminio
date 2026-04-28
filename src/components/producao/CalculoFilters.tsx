import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type FilterMode = 'todos' | 'nenhum' | 'somente';

interface FilterSectionProps {
  title: string;
  mode: FilterMode;
  onModeChange: (mode: FilterMode) => void;
  options: { key: string; label: string }[];
  selected: string[];
  onSelectedChange: (selected: string[]) => void;
}

function FilterSection({
  title,
  mode,
  onModeChange,
  options,
  selected,
  onSelectedChange,
}: FilterSectionProps) {
  const toggleOption = (key: string) => {
    onSelectedChange(selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key]);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 px-3 pt-3">
        <CardTitle className="text-xs font-bold uppercase tracking-wide text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-3">
        <RadioGroup
          value={mode}
          onValueChange={v => onModeChange(v as FilterMode)}
          className="flex flex-wrap gap-x-4 gap-y-1"
        >
          <div className="flex items-center gap-1.5">
            <RadioGroupItem value="todos" id={`${title}-todos`} />
            <Label htmlFor={`${title}-todos`} className="text-xs font-semibold cursor-pointer">
              TODOS
            </Label>
          </div>
          <div className="flex items-center gap-1.5">
            <RadioGroupItem value="nenhum" id={`${title}-nenhum`} />
            <Label htmlFor={`${title}-nenhum`} className="text-xs font-semibold cursor-pointer">
              NENHUM
            </Label>
          </div>
          <div className="flex items-center gap-1.5">
            <RadioGroupItem value="somente" id={`${title}-somente`} />
            <Label htmlFor={`${title}-somente`} className="text-xs font-semibold cursor-pointer">
              SOMENTE
            </Label>
          </div>
        </RadioGroup>

        {options.length > 0 && (
          <div className="bg-muted/50 rounded-md p-2 space-y-1.5">
            {options.map(opt => (
              <div key={opt.key} className="flex items-center gap-2">
                <Checkbox
                  id={`${title}-${opt.key}`}
                  checked={
                    mode === 'todos' ? true : mode === 'nenhum' ? false : selected.includes(opt.key)
                  }
                  disabled={mode !== 'somente'}
                  onCheckedChange={() => toggleOption(opt.key)}
                />
                <Label
                  htmlFor={`${title}-${opt.key}`}
                  className="text-xs cursor-pointer text-muted-foreground"
                >
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ClassesSectionProps {
  classes: { key: string; label: string; checked: boolean }[];
  onToggle: (key: string) => void;
}

function ClassesSection({ classes, onToggle }: ClassesSectionProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 px-3 pt-3">
        <CardTitle className="text-xs font-bold uppercase tracking-wide text-foreground">
          Calcular Perfis (Classes)
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-1.5">
        {classes.map(cls => (
          <div key={cls.key} className="flex items-center gap-2">
            <Checkbox
              id={`class-${cls.key}`}
              checked={cls.checked}
              onCheckedChange={() => onToggle(cls.key)}
            />
            <Label htmlFor={`class-${cls.key}`} className="text-xs cursor-pointer">
              {cls.label}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export interface CalculoFiltersState {
  perfisClasses: { contramarcos: boolean; arremates: boolean; caixilhos: boolean };
  perfisFases: { mode: FilterMode; selected: string[] };
  componentes: { mode: FilterMode; selected: string[] };
  vidros: { mode: FilterMode; selected: string[] };
  telasChapas: { mode: FilterMode; selected: string[] };
}

const defaultState: CalculoFiltersState = {
  perfisClasses: { contramarcos: true, arremates: false, caixilhos: false },
  perfisFases: { mode: 'todos', selected: [] },
  componentes: { mode: 'todos', selected: [] },
  vidros: { mode: 'todos', selected: [] },
  telasChapas: { mode: 'nenhum', selected: [] },
};

const fasesOptions = [
  { key: 'arremate', label: 'Arremate' },
  { key: 'cm', label: 'CM' },
  { key: 'esteira', label: 'Esteira' },
  { key: 'fabr', label: 'Fabr' },
];

const componentesOptions = [
  { key: 'arremate', label: 'Arremate' },
  { key: 'cm', label: 'CM' },
  { key: 'esteira', label: 'Esteira' },
  { key: 'fabr', label: 'Fabr' },
];

const vidrosOptions = [{ key: 'vidros', label: 'Vidros' }];

interface Props {
  value?: CalculoFiltersState;
  onChange?: (state: CalculoFiltersState) => void;
}

export default function CalculoFilters({ value, onChange }: Props) {
  const [internal, setInternal] = useState<CalculoFiltersState>(defaultState);
  const state = value ?? internal;
  const update = (newState: CalculoFiltersState) => {
    if (onChange) onChange(newState);
    else setInternal(newState);
  };

  const toggleClass = (key: keyof typeof state.perfisClasses) => {
    update({
      ...state,
      perfisClasses: { ...state.perfisClasses, [key]: !state.perfisClasses[key] },
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Configuração de Cálculo</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Perfis Classes */}
        <ClassesSection
          classes={[
            {
              key: 'contramarcos',
              label: 'CONTRAMARCOS',
              checked: state.perfisClasses.contramarcos,
            },
            {
              key: 'arremates',
              label: 'ARREMATES (REMATES/ALIZARES)',
              checked: state.perfisClasses.arremates,
            },
            {
              key: 'caixilhos',
              label: 'CAIXILHOS (PERFIS EXCETO CONTRAMARCOS E ARREMATES)',
              checked: state.perfisClasses.caixilhos,
            },
          ]}
          onToggle={key => toggleClass(key as keyof typeof state.perfisClasses)}
        />

        {/* Perfis Fases */}
        <FilterSection
          title="Calcular Perfis (Fases)"
          mode={state.perfisFases.mode}
          onModeChange={mode => update({ ...state, perfisFases: { ...state.perfisFases, mode } })}
          options={fasesOptions}
          selected={state.perfisFases.selected}
          onSelectedChange={selected =>
            update({ ...state, perfisFases: { ...state.perfisFases, selected } })
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Componentes */}
        <FilterSection
          title="Calcular Componentes"
          mode={state.componentes.mode}
          onModeChange={mode => update({ ...state, componentes: { ...state.componentes, mode } })}
          options={componentesOptions}
          selected={state.componentes.selected}
          onSelectedChange={selected =>
            update({ ...state, componentes: { ...state.componentes, selected } })
          }
        />

        {/* Vidros */}
        <FilterSection
          title="Calcular Vidros"
          mode={state.vidros.mode}
          onModeChange={mode => update({ ...state, vidros: { ...state.vidros, mode } })}
          options={vidrosOptions}
          selected={state.vidros.selected}
          onSelectedChange={selected => update({ ...state, vidros: { ...state.vidros, selected } })}
        />

        {/* Telas/Chapas */}
        <FilterSection
          title="Calcular Telas Chapas"
          mode={state.telasChapas.mode}
          onModeChange={mode => update({ ...state, telasChapas: { ...state.telasChapas, mode } })}
          options={[]}
          selected={state.telasChapas.selected}
          onSelectedChange={selected =>
            update({ ...state, telasChapas: { ...state.telasChapas, selected } })
          }
        />
      </div>
    </div>
  );
}
