import {
  Bell,
  Package,
  DollarSign,
  Wrench,
  Users,
  AlertTriangle,
  AlertCircle,
  Info,
} from 'lucide-react';
import type { NotificationType } from '@/hooks/use-notifications';

export const typeConfig: Record<
  NotificationType,
  { icon: typeof Package; label: string; color: string; bgColor: string; route: string }
> = {
  estoque: {
    icon: Package,
    label: 'Estoque',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    route: '/estoque',
  },
  pagamento: {
    icon: DollarSign,
    label: 'Financeiro',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    route: '/financeiro',
  },
  producao: {
    icon: Wrench,
    label: 'Produção',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    route: '/producao',
  },
  crm: {
    icon: Users,
    label: 'CRM',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    route: '/crm',
  },
};

export const severityConfig = {
  critical: {
    icon: AlertTriangle,
    label: 'Crítico',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  warning: { icon: AlertCircle, label: 'Aviso', color: 'text-warning', bgColor: 'bg-warning/10' },
  info: { icon: Info, label: 'Info', color: 'text-muted-foreground', bgColor: 'bg-muted' },
};

export type FilterType = 'todos' | NotificationType;
export type FilterStatus = 'todos' | 'lidas' | 'nao_lidas';

export const typeFilterItems: { key: FilterType; label: string; icon: typeof Bell }[] = [
  { key: 'todos', label: 'Todos', icon: Bell },
  { key: 'estoque', label: 'Estoque', icon: Package },
  { key: 'pagamento', label: 'Financeiro', icon: DollarSign },
  { key: 'producao', label: 'Produção', icon: Wrench },
  { key: 'crm', label: 'CRM', icon: Users },
];

export const statusFilterItems: { key: FilterStatus; label: string }[] = [
  { key: 'todos', label: 'Todas' },
  { key: 'nao_lidas', label: 'Não lidas' },
  { key: 'lidas', label: 'Lidas' },
];
