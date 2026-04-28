import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { AppNotification } from '@/hooks/use-notifications';
import { typeConfig, severityConfig } from './notificacoes-config';

interface NotificacaoItemProps {
  notification: AppNotification;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onClick: (n: AppNotification) => void;
}

export function NotificacaoItem({
  notification: n,
  isSelected,
  onToggleSelect,
  onClick,
}: NotificacaoItemProps) {
  const tc = typeConfig[n.type];
  const sc = severityConfig[n.severity];
  const Icon = tc.icon;
  const SevIcon = sc.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 border-b last:border-0 transition-colors group',
        n.read ? 'opacity-60 bg-muted/20' : 'bg-card',
        isSelected && 'bg-primary/5'
      )}
    >
      <div className="pt-0.5">
        <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(n.id)} />
      </div>

      <div
        className={cn(
          'mt-0.5 shrink-0 h-9 w-9 rounded-full flex items-center justify-center',
          tc.bgColor,
          tc.color
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <button onClick={() => onClick(n)} className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{n.msg}</p>
          {!n.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
        </div>
        {n.detail && <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.detail}</p>}
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={cn(
              'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
              tc.bgColor,
              tc.color
            )}
          >
            {tc.label}
          </span>
          <span
            className={cn(
              'text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5',
              sc.bgColor,
              sc.color
            )}
          >
            <SevIcon className="h-2.5 w-2.5" />
            {sc.label}
          </span>
          <span className="text-[10px] text-muted-foreground ml-auto">{n.time} atrás</span>
        </div>
      </button>
    </div>
  );
}
