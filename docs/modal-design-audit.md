# Auditoria Completa: Sistema de Modais (Design)

**Data:** 28 de Abril de 2026  
**Sistema:** AluFlow - Sistema de Gestão para Esquadrias de Alumínio  
**Autor:** Auditoria de Design

---

## 1. Inventario do Sistema de Modais

### Componentes Base (Building Blocks)

| Componente | Arquivo | Tecnologia | Proposito |
|------------|---------|------------|-----------|
| `Dialog` | `src/components/ui/dialog.tsx` | Radix UI | Dialog padrao desktop |
| `AlertDialog` | `src/components/ui/alert-dialog.tsx` | Radix UI | Confirmacoes destrutivas |
| `Sheet` | `src/components/ui/sheet.tsx` | Radix UI | Painel lateral |
| `Drawer` | `src/components/ui/drawer.tsx` | Vaul | Bottom-sheet mobile |
| `ResponsiveDialog` | `src/components/ui/responsive-dialog.tsx` | Wrapper | Dialog desktop / Drawer mobile |

### Uso por Componente

| Tipo | Arquivos | Adocao |
|------|----------|--------|
| `Dialog` | 39 | Padrao dominante |
| `AlertDialog` | 12+ | Confirmacoes destrutivas |
| `ResponsiveDialog` | **3 apenas** | Subutilizado |
| `Sheet` | 1 (sidebar mobile) | OK |

### Arquivos que usam Dialog

```
src/pages/Orcamentos.tsx
src/pages/Clientes.tsx
src/pages/Financeiro.tsx
src/pages/Agenda.tsx
src/pages/Estoque.tsx
src/pages/Produtos.tsx
src/pages/PlanoCorte.tsx
src/pages/Relatorios.tsx
src/pages/RelacaoMateriais.tsx
src/pages/OrcamentoDetail.tsx
src/pages/Producao.tsx
src/pages/Tipologias.tsx
src/pages/CRM.tsx
src/pages/ProjetoVidro.tsx
src/components/producao/NovoPedidoDialog.tsx
src/components/producao/AlterarEtapaDialog.tsx
src/components/producao/ReagendarDialog.tsx
src/components/producao/EditarServicoDialog.tsx
src/components/producao/ImpressoesDialog.tsx
src/components/producao/PagamentosDialog.tsx
src/components/producao/ContratoDialog.tsx
src/components/producao/checklist/AddEtapaDialog.tsx
src/components/producao/checklist/EditEtapaDialog.tsx
src/components/plano-corte/CNCExportDialog.tsx
src/components/tipologias/TypologyDetailDialog.tsx
src/components/tipologias/ComponentRulesManager.tsx
src/components/tipologias/CutRulesManager.tsx
src/components/tipologias/GlassRulesManager.tsx
src/components/orcamento/MaterialDetailDialog.tsx
src/components/PdfPreviewDialog.tsx
src/components/pedidos/PedidoTracking.tsx
src/components/projeto-vidro/ProjetoDetalhe.tsx
src/components/projeto-vidro/MultiProjetoSummary.tsx
src/components/configuracoes/EquipeTab.tsx
src/components/configuracoes/AdminsTab.tsx
src/components/configuracoes/ApisTab.tsx
src/components/mof/CatalogBrowser.tsx
```

### Arquivos que usam ResponsiveDialog

```
src/components/producao/PagamentosDialog.tsx
src/components/producao/ContratoDialog.tsx
src/pages/OrcamentoDetail.tsx
```

---

## 2. Problemas Criticos Identificados

### 2.1 Inconsistencia de Largura (max-width) - ALTA

Foram encontrados **12 valores diferentes** de largura nos modais, sem padrao:

| Largura | Onde |
|---------|------|
| `max-w-md` (28rem) | Clientes, EditarServico |
| `sm:max-w-md` | AlterarEtapa, Reagendar, Impressoes, AddEtapa, EditEtapa, Estoque, Agenda, Financeiro, PlanoCorte, ComponentRulesManager |
| `max-w-lg` | NovoPedido |
| `sm:max-w-lg` | Produtos, MultiProjetoSummary, ProjetoDetalhe (csv), CutRulesManager |
| `max-w-2xl` | MaterialDetail, Orcamentos |
| `sm:max-w-2xl` | Orcamentos detail |
| `max-w-3xl` | TypologyDetail |
| `max-w-4xl` | PdfPreview |
| `sm:max-w-[500px]` | CNCExport |
| `sm:max-w-[460px]` | ProjetoDetalhe |
| `max-w-[calc(100vw-2rem)] sm:max-w-md` | Financeiro, Agenda, Estoque |

**Problema:** Sem sistema de tamanhos padronizado (small/medium/large/xl).

### 2.2 ResponsiveDialog Subutilizado - ALTA

Apenas **3 de 39 modais** usam `ResponsiveDialog`. A maioria usa `Dialog` direto, que em mobile fica desconfortavel (modal centralizado em telas pequenas).

### 2.3 Disparidade Visual Extrema - ALTA

Comparacao entre dois modais do mesmo sistema:

**Orcamentos (premium):**
```tsx
- Header com gradient + radial gradient + animated dot
- Cards arredondados (rounded-2xl) com hover effects
- Badge de status com pulse animation
- Total card com gradient overlay
- Botoes com shadow personalizado
```

**EditarServico/AlterarEtapa (basico):**
```tsx
- Header simples com texto
- Inputs flat
- Botoes padrao sem efeitos
- Sem hierarquia visual
```

### 2.4 Falta de DialogDescription - MEDIA

Apenas **2 modais** usam `DialogDescription` (CNCExport, Orcamentos). Radix UI emite warnings de acessibilidade quando ausente.

---

## 3. Problemas Medios Identificados

### 3.1 Padroes de Footer Inconsistentes

| Padrao | Frequencia |
|--------|-----------|
| `<DialogFooter>` com Button outline + filled | ~70% |
| `<div className="flex gap-3 pt-2">` inline | EditarServico, MaterialDetail |
| Sem DialogFooter (botoes inline) | PdfPreview, MaterialDetail |
| Apenas botao "Fechar" | Pagamentos, Impressoes |

### 3.2 Padroes de Loading Inconsistentes

| Padrao | Modais |
|--------|--------|
| `<Loader2 className="animate-spin" />` | NovoPedido, PdfPreview |
| Texto "Salvando..." | AlterarEtapa, Reagendar, EditarServico, Add/EditEtapa |
| Skeleton/spinner customizado | Outros |

### 3.3 Padding/Spacing Variavel

```tsx
// Padrao 1: py-2 (compacto)
<div className="space-y-4 py-2">

// Padrao 2: pt-2 
<div className="space-y-4 pt-2">

// Padrao 3: py-4 (espacoso)
<div className="space-y-6 py-4">

// Padrao 4: sem padding
<div className="space-y-4">
```

### 3.4 PdfPreview Quebra Padrao

```tsx
<DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
```
- Usa `p-0` removendo padding padrao
- Header customizado com `border-b`
- iframe full-height

### 3.5 ImpressoesDialog tem 200+ linhas de HTML inline

```tsx
function buildOrdemServicoHTML(pedido: Pedido): string {
  return `<!DOCTYPE html><html...`  // 130+ linhas de CSS inline
}
```
**Problema:** HTML/CSS gigante misturado em componente React.

---

## 4. Problemas Baixa Prioridade

### 4.1 Z-index Conflitos Potenciais

| Componente | z-index |
|------------|---------|
| Dialog Overlay | `z-[9998]` |
| Dialog Content | `z-[9999]` |
| AlertDialog Overlay | `z-[9998]` |
| AlertDialog Content | `z-[9999]` |
| Sheet Overlay | `z-50` |
| Sheet Content | `z-50` |
| Drawer Overlay | `z-50` |
| Drawer Content | `z-50` |

**Problema:** Sheets e Drawers com z-50 podem ficar atras de Dialogs (z-9999).

### 4.2 Sheet usa `glass-strong` mas Dialog nao

Inconsistencia visual entre componentes do mesmo grupo.

### 4.3 Drawer Bottom Indicator Duplicado

`ResponsiveDialog` adiciona handle bar (linha 75), mas o `DrawerContent` ja inclui um (linha 46 do drawer.tsx). **Duplicacao visual**.

### 4.4 Fechar (Close) Button Inconsistente

| Componente | Botao fechar |
|------------|--------------|
| Dialog | `rounded-full` no canto direito |
| Sheet | `rounded-sm` (default) |
| Drawer | Sem botao (handle bar) |
| AlertDialog | Sem botao (forcar acao) |

### 4.5 Animacoes Inconsistentes

```tsx
// Dialog: simples
duration-200

// AlertDialog: complexa com slide + zoom
data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] zoom-in-95

// Sheet: lateral
slide-in-from-right
```

---

## 5. Problemas de UX/Mobile

| Problema | Impacto |
|----------|---------|
| Modais grandes (`max-w-3xl`, `max-w-4xl`) em mobile = full-screen sem otimizacao | Alto |
| `EditarServicoDialog` tem 7 campos sem usar Drawer mobile | Medio |
| Botoes "Cancelar" e "Salvar" centrados ficam dificeis de tocar | Medio |
| Modal de pagamento usa grid de 3 colunas em mobile | Alto |
| Cor de overlay diferente: `bg-black/50` (Dialog) vs `bg-black/80` (Sheet/Drawer) | Baixo |
| AlertDialog nao tem largura responsiva otimizada | Medio |

---

## 6. Problemas de Acessibilidade

| Item | Status |
|------|--------|
| `DialogDescription` ausente | 37/39 modais (warnings Radix) |
| `aria-label` nos botoes de fechar | OK (sr-only) |
| Focus trap | OK (Radix) |
| ESC fecha modal | OK (Radix) |
| Click fora fecha | OK (Radix) |
| Botoes de acao sem `type="button"` | Multiplos arquivos |
| Tab order apos fechar modal | Nao testado |

---

## 7. Analise Detalhada dos Modais

### 7.1 Modais com Design Premium (Orcamentos)

O modal de Orcamentos e o unico com design premium:

```tsx
<DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl p-0 flex flex-col border-0 shadow-2xl shadow-primary/5">
  {/* Premium header */}
  <div className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-accent/20" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.1),transparent_60%)]" />
    {/* ... */}
  </div>
  {/* Cards com gradient */}
  <div className="group rounded-2xl border border-border/50 bg-gradient-to-b from-muted/40 to-muted/10">
  {/* Total card com gradient overlay */}
  <div className="relative overflow-hidden rounded-2xl border border-primary/20 p-5">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/4 to-accent/10" />
```

### 7.2 Modais com Design Basico

A maioria dos modais segue o padrao basico:

```tsx
<DialogContent className="sm:max-w-md">
  <DialogHeader>
    <DialogTitle>Titulo</DialogTitle>
  </DialogHeader>
  <div className="space-y-4 py-2">
    {/* campos */}
  </div>
  <DialogFooter>
    <Button variant="outline" onClick={onClose}>Cancelar</Button>
    <Button onClick={handleSave}>Salvar</Button>
  </DialogFooter>
</DialogContent>
```

### 7.3 DialogDescription Uso

Apenas CNCExportDialog e OrcamentosDialog usam DialogDescription:

```tsx
// CNCExportDialog
<DialogDescription>
  Configure os parametros para exportar o arquivo de corte otimizado
</DialogDescription>

// OrcamentosDialog
<DialogDescription className="text-xs flex items-center gap-1.5">
  <Calendar className="h-3 w-3" />
  Criado em {formatDate(orc.created_at)}
</DialogDescription>
```

---

## 8. Componente ResponsiveDialog

### 8.1 Estrutura

O `ResponsiveDialog` e um wrapper inteligente que:

1. Em **desktop** (`isMobile === false`): renderiza `Dialog` padrao
2. Em **mobile** (`isMobile === true`): renderiza `Drawer` (bottom-sheet)

### 8.2 Tamanhos Disponiveis

```tsx
const sizeClasses: Record<ResponsiveDialogSize, { desktop: string; mobile: string }> = {
  sm: {
    desktop: 'max-w-md',
    mobile: 'max-h-[85vh]',
  },
  md: {
    desktop: 'max-w-2xl',
    mobile: 'max-h-[90vh]',
  },
  lg: {
    desktop: 'max-w-4xl',
    mobile: 'max-h-[95vh]',
  },
};
```

### 8.3 Componentes Helper

| Componente | Uso |
|------------|-----|
| `ResponsiveDialog` | Dialog principal |
| `ResponsiveDialogHeader` | Header automatico |
| `ResponsiveDialogTitle` | Titulo automatico |
| `ResponsiveDialogDescription` | Descricao (pouco usado) |
| `ResponsiveDialogFooter` | Footer automatico |
| `ResponsiveDialogClose` | Botao fechar (apenas mobile) |

---

## 9. Sistema de Cores e Theming

### 9.1 Variaveis CSS

```css
:root {
  --background: 0 0% 100%;
  --foreground: 263 84% 12%;
  --primary: 263 84% 58%;
  --primary-foreground: 0 0% 100%;
  --card: 0 0% 100%;
  --border: 220 13% 91%;
  --radius: 0.75rem;
}

.dark {
  --background: 260 30% 6%;
  --foreground: 220 14% 96%;
  --primary: 263 84% 62%;
  --border: 260 20% 20%;
}
```

### 9.2 Classes Glass

O sistema define classes de glass effect:

```css
.glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.glass-strong {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}
```

---

## 10. Recomendacoes - Plano de Padronizacao

### Tarefa 1: Sistema de Tamanhos Padronizado - P0

Substituir `max-w-md/lg/2xl/3xl` por sistema com tamanhos nomeados:

```tsx
const dialogSizes = {
  sm: 'max-w-sm',     // 24rem - confirmacoes
  md: 'max-w-md',     // 28rem - formularios simples
  lg: 'max-w-2xl',    // 42rem - formularios complexos
  xl: 'max-w-4xl',    // 56rem - detalhes/preview
  full: 'max-w-7xl',  // 80rem - tela cheia
};
```

### Tarefa 2: Migrar para ResponsiveDialog - P0

**Modais que devem ser migrados (alto impacto mobile):**
- `EditarServicoDialog` (7 campos)
- `NovoPedidoDialog` (form complexo)
- `AlterarEtapaDialog` (grid de etapas)
- `ReagendarDialog`
- `AddEtapaDialog`, `EditEtapaDialog`
- Dialogs em `Clientes.tsx`, `Financeiro.tsx`, `Agenda.tsx`, `Estoque.tsx`

### Tarefa 3: Adicionar DialogDescription Universal - P0

Toda janela deve ter:

```tsx
<DialogHeader>
  <DialogTitle>Editar Cliente</DialogTitle>
  <DialogDescription>Atualize as informacoes do cliente.</DialogDescription>
</DialogHeader>
```

### Tarefa 4: Padronizar Footer - P1

```tsx
<DialogFooter>
  <Button variant="outline" onClick={onClose}>
    Cancelar
  </Button>
  <Button onClick={onSave} disabled={loading}>
    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
    {loading ? 'Salvando...' : 'Salvar'}
  </Button>
</DialogFooter>
```

### Tarefa 5: Resolver Z-Index - P1

Padronizar para sistema unico:

```tsx
const Z_INDEX = {
  overlay: 'z-50',
  dialog: 'z-50',
  popover: 'z-[60]',
  toast: 'z-[100]',
};
```

### Tarefa 6: Remover Handle Bar Duplicado em ResponsiveDialog - P1

```tsx
// Em ResponsiveDialog
if (isMobile) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={cn(classes.mobile, 'max-w-full', className)}>
        {/* REMOVER: <div className="mx-auto mt-4 h-1.5 w-12 ..." /> */}
        {children}
      </DrawerContent>
    </Drawer>
  );
}
```

### Tarefa 7: Extrair HTML Templates de ImpressoesDialog - P2

Mover funcoes `buildOrdemServicoHTML` e `buildGenericHTML` para arquivo separado: `src/utils/printTemplates/`.

### Tarefa 8: Padronizar Estilo Premium (opcional) - P2

Aplicar gradientes/animacoes do `OrcamentosDialog` em outros modais "principais" (DetailDialogs).

---

## 11. Priorizacao das Melhorias

| # | Tarefa | Impacto | Esforco | Prioridade |
|---|--------|---------|---------|-----------|
| 1 | Sistema de tamanhos padronizado | Alto | Baixo | P0 |
| 2 | Migrar para ResponsiveDialog | Alto | Medio | P0 |
| 3 | DialogDescription universal | Medio (a11y) | Baixo | P0 |
| 4 | Padronizar footer | Medio | Baixo | P1 |
| 5 | Resolver z-index | Baixo | Baixo | P1 |
| 6 | Remover handle duplicado | Baixo | Trivial | P1 |
| 7 | Extrair HTML templates | Medio | Medio | P2 |
| 8 | Estilo premium uniforme | Alto (UX) | Alto | P2 |

---

## 12. Resumo Executivo

| Categoria | Quantidade | Status |
|-----------|------------|--------|
| **Modais totais** | 39 Dialog + 12 AlertDialog + 3 ResponsiveDialog | - |
| **Larguras diferentes** | 12 valores | Inconsistente |
| **Padroes de footer** | 4+ variacoes | Inconsistente |
| **Mobile responsivo** | Apenas 3/39 | Critico |
| **DialogDescription** | 2/39 | Acessibilidade ruim |
| **Z-index conflitos** | Possiveis (Sheet vs Dialog) | Risco |
| **Estilo visual** | Basico maioria, premium em 1 | Disparidade |

### Pontos Positivos

- Bom componente base `Dialog` (Radix UI)
- `ResponsiveDialog` ja existe (so precisa ser mais usado)
- Animacoes funcionando
- Theme dark/light suportado
- Componente de Drawer pronto para mobile

### Pontos Criticos

- **97% dos modais nao sao otimizados para mobile** (so 3 usam ResponsiveDialog)
- **95% sem DialogDescription** (warnings de acessibilidade)
- **12 valores diferentes** de largura sem padrao
- Disparidade enorme entre modal "Orcamentos" (premium) e os demais (basicos)

---

## 13. Proximos Passos

1. Implementar sistema de tamanhos padronizado no `dialog.tsx`
2. Migrar modais criticos para ResponsiveDialog
3. Adicionar DialogDescription em todos os modais
4. Padronizar footer e loading states
5. Resolver conflitos de z-index
6. Extrair templates HTML para arquivos separados
7. Considerar aplicar estilo premium em outros modais principais

---

*Documento gerado em 28/04/2026*
