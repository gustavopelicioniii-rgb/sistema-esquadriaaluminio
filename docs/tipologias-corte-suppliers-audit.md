# Auditoria Completa: Tipologias, Planos de Corte e Fornecedores

**Data:** 28 de Abril de 2026
**Sistema:** AluFlow - Sistema de Gestão para Esquadrias de Alumínio
**Autor:** Auditoria de Design

---

## 1. Inventário do Sistema de Tipologias

### 1.1 Arquivos Principais

| Arquivo | Tecnologia | Propósito |
|---------|-----------|-----------|
| `src/pages/Tipologias.tsx` | React | Página principal de tipologias |
| `src/components/tipologias/TypologyFilters.tsx` | React | Painel de filtros |
| `src/components/tipologias/TypologyCatalogGrid.tsx` | React | Grade do catálogo |
| `src/components/tipologias/TypologyCustomTable.tsx` | React | Tabela customizadas |
| `src/components/tipologias/TypologyDetailDialog.tsx` | React/Radix | Detalhe da tipologia |
| `src/components/tipologias/CutRulesManager.tsx` | React | Regras de corte |
| `src/components/tipologias/GlassRulesManager.tsx` | React | Regras de vidro |
| `src/components/tipologias/ComponentRulesManager.tsx` | React | Regras de componentes |
| `src/data/catalog/typologies.ts` | TypeScript | Catálogo estático (~57 tipologias) |
| `src/data/catalog/cutRules/*.ts` | TypeScript | Regras de corte por linha |
| `src/hooks/use-custom-cut-rules.tsx` | React Hook | CRUD regras de corte customizadas |
| `src/hooks/use-custom-glass-rules.tsx` | React Hook | CRUD regras de vidro customizadas |
| `src/hooks/use-custom-component-rules.tsx` | React Hook | CRUD regras de componentes customizadas |
| `src/lib/calculation-engine.ts` | TypeScript | Motor de cálculo |
| `src/types/calculation.ts` | TypeScript | Tipos TypeScript |

### 1.2 Schema do Banco de Dados

**Tabela: `tipologias_customizadas`**
```sql
id UUID PK, user_id UUID, product_line_id TEXT,
name TEXT, category TEXT, subcategory TEXT,
num_folhas INTEGER, has_veneziana BOOLEAN, has_bandeira BOOLEAN,
notes TEXT, active BOOLEAN,
min_width_mm INTEGER, max_width_mm INTEGER,
min_height_mm INTEGER, max_height_mm INTEGER,
created_at, updated_at
```

**Tabela: `regras_corte_customizadas`**
```sql
id UUID PK, typology_id UUID FK,
profile_code TEXT, piece_name TEXT, piece_function TEXT,
reference_dimension TEXT, coefficient NUMERIC, constant_mm NUMERIC,
fixed_value_mm NUMERIC, cut_angle_left NUMERIC, cut_angle_right NUMERIC,
quantity_formula TEXT, sort_order INTEGER, weight_per_meter NUMERIC, notes TEXT
```

**Tabela: `regras_vidro_customizadas`**
```sql
id UUID PK, typology_id UUID FK,
glass_name TEXT, width_reference TEXT, width_constant_mm NUMERIC,
height_reference TEXT, height_constant_mm NUMERIC, quantity INTEGER,
glass_type TEXT, min_thickness_mm NUMERIC, max_thickness_mm NUMERIC, notes TEXT
```

**Tabela: `regras_componentes_customizadas`**
```sql
id UUID PK, typology_id UUID FK,
component_name TEXT, component_code TEXT, component_type TEXT,
quantity_formula TEXT, unit TEXT, length_reference TEXT,
length_constant_mm NUMERIC, notes TEXT, sort_order INTEGER
```

---

## 2. Problemas Críticos Identificados

### 2.1 Bug: Toast de Sucesso Errado - ALTA

No arquivo `src/pages/Tipologias.tsx`, linha 318:

```tsx
toast.error('Tipologia removida');
```

**Problema:** Após deletar uma tipologia, exibe `toast.error` ao invés de `toast.success`.

### 2.2 Filtro de Categoria Não Funciona em Customizadas - ALTA

Em `src/pages/Tipologias.tsx`, o `filteredCustom` (linha 201-208) **não aplica** os filtros de categoria, subcategoria, folhas, veneziana e bandeira:

```tsx
const filteredCustom = useMemo(
  () =>
    customs.filter(t => {
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
      const matchLine = filterLine === 'all' || t.product_line_id === filterLine;
      return matchSearch && matchLine;
      // FALTA: matchCategory, matchSubcategory, matchFolhas, etc.
    }),
  [customs, search, filterLine]
);
```

### 2.3 Sem Validação de Dimensões - ALTA

Em `handleSave()` (linha 211), não há validação de que `min_width_mm < max_width_mm` ou valores positivos.

### 2.4 Sem Detecção de Duplicatas - MEDIA

Não impede criar duas tipologias customizadas com o mesmo `name` para o mesmo usuário.

---

## 3. Sistema de Planos de Corte

### 3.1 Arquivos Relacionados

| Arquivo | Propósito |
|---------|-----------|
| `src/pages/PlanoCorte.tsx` | Página principal |
| `src/hooks/use-planos-corte.tsx` | CRUD de planos de corte |
| `src/components/plano-corte/CNCExportDialog.tsx` | Exportação CNC |
| `src/components/plano-corte/CutsTable.tsx` | Tabela de cortes |
| `src/components/plano-corte/BarVisualization.tsx` | Visualização de barras |
| `src/utils/cutListPdfGenerator.ts` | PDF Lista de Barras |
| `src/utils/padroesCortePdfGenerator.ts` | PDF Padrões de Corte |
| `src/utils/cnc/cutFileExporter.ts` | Exportação CNC (G-code, CSV, XML) |

### 3.2 Máquinas CNC Suportadas

- Generic G-Code
- Schuldte Profi 45
- Metabo HPT WVG-65/90
- Bambach Frame Mate/matic
- Emmegi Poly Line/Tech
- Elaterm SC-300/SC-400
- Celmack CM-450
- Rotal Rotalcut 500
- ProMax PMC-5000
- Fischer Hydrocut

### 3.3 Problemas Identificados - Planos de Corte

| Problema | Severidade | Descrição |
|-----------|------------|-----------|
| Comprimento de barra hardcoded | ALTA | 6000mm definido inline em `optimizeBars()` |
| Threshold 45° hardcoded | MEDIA | 600mm como limite para cortes 45° |
| Sem resumo consolidado | BAIXA | Não existe visão agregada de necessidades de material |
| CNCExportDialog sem DialogDescription | MEDIA | Falta acessibilidade (JÁ CORRIGIDO ANTERIORMENTE) |

---

## 4. Sistema de Fornecedores / MOF

### 4.1 Estrutura Atual

**Tipos (`src/data/catalog/suppliers/types.ts`):**
- `SupplierProfile` - Perfis de alumínio (sem campos de imagem)
- `SupplierGlass` - Vidros (sem campos de imagem)
- `SupplierComponent` - Componentes (sem campos de imagem)

**Catálogos Estáticos:**
- 7 fabricantes de perfis: Gold, Suprema, Aluprime, Deca, Tamizzi, Aluvid, Glaster
- 4 fabricantes de vidro: BFV, Cemperfil, Box Inglês, Termocuil
- 3 fabricantes de componentes: Pormade, Suprema, Gold

**Storage Buckets Existentes:**
- `checklist-fotos` (privado) - Fotos de checklist
- `company-assets` (público) - Logo da empresa

### 4.2 Gaps Identificados - Fornecedores

| Gap | Severidade | Descrição |
|-----|------------|-----------|
| Sem campos de imagem | ALTA | Tipos não têm `image_url` ou `datasheet_url` |
| Sem UI de upload | ALTA | Não existe interface para upload de arquivos |
| Sem bucket dedicado | MEDIA | Não existe `supplier-files` bucket |
| Sem gestão de fornecedores | MEDIA | Tudo é TypeScript estático |
| Sem visualização de imagens | MEDIA | CatalogBrowser só mostra texto |

---

## 5. Plano de Melhorias - Priorização

### Tarefa 1: Correções P0 (Bug Fixes)

| # | Arquivo | Problema | Status |
|---|---------|----------|--------|
| 1 | `Tipologias.tsx:318` | `toast.error` → `toast.success` no delete | A FAZER |
| 2 | `Tipologias.tsx` | Adicionar filtros de categoria para customizadas | A FAZER |
| 3 | `Tipologias.tsx` | Adicionar validação de dimensões | A FAZER |
| 4 | `CNCExportDialog.tsx` | Já possui DialogDescription | ✅ |

### Tarefa 2: Melhorias P1 (Validação e UX)

| # | Arquivo | Melhoria |
|---|---------|----------|
| 5 | `Tipologias.tsx` | Detecção de duplicatas de nome |
| 6 | `use-planos-corte.tsx` | Externalizar comprimento de barra |
| 7 | `cutListPdfGenerator.ts` | Usar configuração de barra |

### Tarefa 3: Sistema de Fornecedores P2

| # | Arquivo | Melhoria |
|---|---------|----------|
| 8 | `suppliers/types.ts` | Adicionar campos de imagem |
| 9 | `CatalogBrowser.tsx` | Exibir imagens quando disponíveis |
| 10 | `FornecedoresTab.tsx` | Criar aba de upload de arquivos |
| 11 | Supabase | Criar bucket `supplier-files` |

---

## 6. Validações Realizadas

- **Lint:** ✅ 0 erros
- **Typecheck:** ✅ Passou

---

## 7. Próximos Passos

1. ✅ CNCExportDialog já tem DialogDescription
2. Corrigir `toast.error` → `toast.success` em Tipologias.tsx
3. Aplicar filtros de categoria em tipologias customizadas
4. Adicionar validação de dimensões (min < max)
5. Externalizar comprimento de barra para configuração
6. Adicionar campos de imagem aos tipos de fornecedores
7. Implementar visualização de imagens no CatalogBrowser
8. Criar FornecedoresTab com upload de arquivos

---

*Documento gerado em 28/04/2026*
