import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import PedidoCardCompact from './PedidoCardCompact';
import type { Pedido } from '@/pages/Producao';
import { cn } from '@/lib/utils';

const columns: { key: string; label: string; color: string }[] = [
  { key: 'em_andamento', label: 'Em Andamento', color: 'border-t-primary' },
  { key: 'atrasado', label: 'Atrasados', color: 'border-t-destructive' },
  { key: 'concluido', label: 'Concluídos', color: 'border-t-emerald-500' },
];

interface Props {
  pedidos: Pedido[];
  progressMap?: Record<string, number>;
  onStatusChange: (id: string, newStatus: string) => void;
  onOpenDetail: (p: Pedido) => void;
  onOpenDialog: (type: string, p: Pedido) => void;
  onConcluir: (p: Pedido) => void;
  onCancelar: (p: Pedido) => void;
}

export default function KanbanBoard({
  pedidos,
  progressMap = {},
  onStatusChange,
  onOpenDetail,
  onOpenDialog,
  onConcluir,
  onCancelar,
}: Props) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId;
    const pedidoId = result.draggableId;
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (pedido && pedido.status !== newStatus) {
      onStatusChange(pedidoId, newStatus);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(col => {
          const items = pedidos.filter(p => p.status === col.key);
          return (
            <div
              key={col.key}
              className={cn('rounded-lg border border-t-4 bg-muted/30', col.color)}
            >
              <div className="px-3 py-2 flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {col.label}
                </h4>
                <span className="text-[10px] font-bold bg-muted rounded-full px-2 py-0.5 text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <Droppable droppableId={col.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'px-2 pb-2 space-y-2 min-h-[120px] transition-colors rounded-b-lg',
                      snapshot.isDraggingOver && 'bg-primary/5'
                    )}
                  >
                    {items.map((op, index) => (
                      <Draggable key={op.id} draggableId={op.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <PedidoCardCompact
                              pedido={op}
                              progress={progressMap[op.id]}
                              onOpenDetail={onOpenDetail}
                              onOpenDialog={onOpenDialog}
                              onConcluir={onConcluir}
                              onCancelar={onCancelar}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {items.length === 0 && (
                      <p className="text-center text-xs text-muted-foreground py-8">
                        Arraste pedidos aqui
                      </p>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
