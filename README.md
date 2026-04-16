# AluFlow - Sistema de Gestão para Esquadrias

Sistema ERP completo para gestão de empresas de esquadrias de alumínio e vidro.

## Funcionalidades

- ✅ Cálculo de Esquadrias (motor de cálculo automático)
- ✅ Plano de Corte Otimizado
- ✅ Gestão de Clientes (CRM)
- ✅ Orçamentos e Pedidos
- ✅ Controle de Estoque
- ✅ Gestão Financeira
- ✅ Produção e Agenda
- ✅ Relatórios
- ✅ Geração de PDFs
- ✅ Visualização 2D/3D de esquadrias

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI:** shadcn/ui + Radix UI + Tailwind CSS
- **Backend:** Supabase (Auth + Database + Edge Functions)
- **Deploy:** Vercel

## Configuração

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente (.env):
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave
   ```
4. Execute localmente: `npm run dev`

## Deploy

O sistema faz deploy automático via GitHub Actions a cada push na branch main.

## Licença

MIT
