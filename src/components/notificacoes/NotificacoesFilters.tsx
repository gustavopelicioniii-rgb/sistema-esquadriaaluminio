import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppNotification } from '@/hooks/use-notifications';
import {
  typeFilterItems,
  statusFilterItems,
  type FilterType,
  type FilterStatus,
} from './notificacoes-config';

interface NotificacoesFiltersProps {
  notifications: AppNotification[];
  filterType: FilterType;
  filterStatus: FilterStatus;
  onFilterType: (v: FilterType) => void;
  onFilterStatus: (v: FilterStatus) => void;
}

export function DesktopFilters({
  notifications,
  filterType,
  filterStatus,
  onFilterType,
  onFilterStatus,
}: NotificacoesFiltersProps) {
  const getCounts = (type: FilterType) =>
    type === 'todos' ? notifications.length : notifications.filter(n => n.type === type).length;

  return (
    <div className="w-52 shrink-0 space-y-6 hidden md:block">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          <Filter className="h-3 w-3 inline mr-1" />
          FILTRAR POR TIPO
        </p>
        <div className="space-y-0.5">
          {typeFilterItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => onFilterType(item.key)}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  filterType === item.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </span>
                <span
                  className={cn(
                    'flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] font-bold',
                    filterType === item.key
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {getCounts(item.key)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          STATUS
        </p>
        <div className="space-y-0.5">
          {statusFilterItems.map(item => (
            <button
              key={item.key}
              onClick={() => onFilterStatus(item.key)}
              className={cn(
                'flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                filterStatus === item.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MobileTypeFilter({
  notifications,
  filterType,
  onFilterType,
}: Pick<NotificacoesFiltersProps, 'notifications' | 'filterType' | 'onFilterType'>) {
  const getCounts = (type: FilterType) =>
    type === 'todos' ? notifications.length : notifications.filter(n => n.type === type).length;

  return (
    <div className="md:hidden overflow-x-auto">
      <div className="flex gap-1 p-1 rounded-lg border bg-muted/50 w-fit">
        {typeFilterItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onFilterType(item.key)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0',
                filterType === item.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="h-3 w-3" />
              {item.label}
              <span
                className={cn(
                  'flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] font-bold',
                  filterType === item.key
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {getCounts(item.key)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MobileStatusFilter({
  filterStatus,
  onFilterStatus,
}: Pick<NotificacoesFiltersProps, 'filterStatus' | 'onFilterStatus'>) {
  return (
    <div className="md:hidden flex gap-1 mb-2">
      {statusFilterItems.map(item => (
        <button
          key={item.key}
          onClick={() => onFilterStatus(item.key)}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
            filterStatus === item.key
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-muted/50 text-muted-foreground border-border'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
