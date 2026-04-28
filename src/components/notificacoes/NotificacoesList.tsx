import { Bell, Eye } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { AppNotification } from '@/hooks/use-notifications';
import { NotificacaoItem } from './NotificacaoItem';
import type { FilterType, FilterStatus } from './notificacoes-config';

interface NotificacoesListProps {
  filtered: AppNotification[];
  selected: Set<string>;
  filterType: FilterType;
  filterStatus: FilterStatus;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onMarkSelectedRead: () => void;
  onClickNotification: (n: AppNotification) => void;
}

export function NotificacoesList({
  filtered,
  selected,
  filterType,
  filterStatus,
  onToggleSelect,
  onSelectAll,
  onMarkSelectedRead,
  onClickNotification,
}: NotificacoesListProps) {
  return (
    <div className="flex-1 space-y-3 min-w-0">
      {filtered.length > 0 && (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg border bg-card">
          <Checkbox
            checked={selected.size === filtered.length && filtered.length > 0}
            onCheckedChange={onSelectAll}
          />
          <span className="text-xs text-muted-foreground">
            {selected.size > 0 ? `${selected.size} selecionada(s)` : 'Selecionar todas'}
          </span>
          {selected.size > 0 && (
            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={onMarkSelectedRead}
              >
                <Eye className="h-3 w-3" />
                Marcar lidas
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Bell className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma notificação encontrada</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {filterType !== 'todos' || filterStatus !== 'todos'
                ? 'Tente ajustar os filtros'
                : 'Tudo em dia!'}
            </p>
          </div>
        ) : (
          filtered.map(n => (
            <NotificacaoItem
              key={n.id}
              notification={n}
              isSelected={selected.has(n.id)}
              onToggleSelect={onToggleSelect}
              onClick={onClickNotification}
            />
          ))
        )}
      </div>
    </div>
  );
}
