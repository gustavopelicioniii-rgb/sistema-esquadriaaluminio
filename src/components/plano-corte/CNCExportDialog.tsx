import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  supportedMachines,
  getMachineFormats,
  downloadCutFile,
  type CNCMachine,
} from '@/utils/cnc/cutFileExporter';
import type { OptimizationResult } from '@/types/calculation';
import { Download, Settings2, Scissors, Gauge, Ruler, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface CNCExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barResults: OptimizationResult[] | null;
  defaultMachine?: string;
}

export function CNCExportDialog({
  open,
  onOpenChange,
  barResults,
  defaultMachine = 'generic-gcode',
}: CNCExportDialogProps) {
  const [selectedMachine, setSelectedMachine] = useState(defaultMachine);
  const [cncFormat, setCncFormat] = useState<'gcode' | 'csv' | 'xml' | 'proprietary'>('gcode');
  const [feedRate, setFeedRate] = useState(1000);
  const [cutSpeed, setCutSpeed] = useState(3000);
  const [kerfWidth, setKerfWidth] = useState(3);
  const [useAngles, setUseAngles] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const machine = supportedMachines.find(m => m.id === selectedMachine);
  const availableFormats = getMachineFormats(selectedMachine);

  const handleExport = () => {
    if (!barResults || barResults.length === 0) {
      toast.error('Nenhum dado de otimização disponível');
      return;
    }

    if (availableFormats.length === 0) {
      toast.error('Máquina não suporta exportação');
      return;
    }

    setIsExporting(true);
    try {
      downloadCutFile(barResults, selectedMachine, cncFormat, {
        feedRate,
        cutSpeed,
        kerfWidth,
        useAngles,
      });
      toast.success(`Arquivo ${cncFormat.toUpperCase()} exportado com sucesso!`);
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao exportar arquivo CNC');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const resetDefaults = () => {
    setFeedRate(1000);
    setCutSpeed(3000);
    setKerfWidth(3);
    setUseAngles(true);
  };

  const getFormatLabel = (format: string) => {
    const labels: Record<string, string> = {
      gcode: 'G-Code (.nc)',
      csv: 'CSV (.csv)',
      xml: 'XML (.xml)',
      proprietary: 'Proprietário (.txt)',
    };
    return labels[format] || format;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Exportar para CNC
          </DialogTitle>
          <DialogDescription>
            Configure os parâmetros para exportar o arquivo de corte otimizado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Machine Selection */}
          <div className="space-y-2">
            <Label>Máquina</Label>
            <Select value={selectedMachine} onValueChange={setSelectedMachine}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a máquina" />
              </SelectTrigger>
              <SelectContent>
                {supportedMachines.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {m.brand} - {m.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label>Formato</Label>
            <Select
              value={cncFormat}
              onValueChange={v => setCncFormat(v as typeof cncFormat)}
              disabled={availableFormats.length <= 1}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableFormats.map(f => (
                  <SelectItem key={f} value={f}>
                    {getFormatLabel(f)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Separator */}
          <div className="border-t my-4" />

          {/* Machine Info */}
          {machine && (
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <p className="text-sm font-medium">Informações da Máquina</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Marca:</span> {machine.brand}
                </div>
                <div>
                  <span className="text-muted-foreground">Modelo:</span> {machine.model}
                </div>
                <div>
                  <span className="text-muted-foreground">Barra máx:</span>{' '}
                  {machine.max_bar_length_mm}mm
                </div>
                <div>
                  <span className="text-muted-foreground">Corte 45°:</span>{' '}
                  {machine.supports_45_degrees ? 'Sim' : 'Não'}
                </div>
              </div>
            </div>
          )}

          {/* Parameters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1">
                <Gauge className="h-3 w-3" /> Velocidade de Avanço
              </Label>
              <span className="text-sm font-mono">{feedRate} mm/min</span>
            </div>
            <input
              type="range"
              min="300"
              max="3000"
              step="100"
              value={feedRate}
              onChange={e => setFeedRate(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1">
                <Scissors className="h-3 w-3" /> Velocidade de Corte
              </Label>
              <span className="text-sm font-mono">{cutSpeed} RPM</span>
            </div>
            <input
              type="range"
              min="1000"
              max="6000"
              step="100"
              value={cutSpeed}
              onChange={e => setCutSpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1">
                <Ruler className="h-3 w-3" /> Largura do Disco
              </Label>
              <span className="text-sm font-mono">{kerfWidth} mm</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={kerfWidth}
              onChange={e => setKerfWidth(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Angle Support */}
          {machine?.supports_45_degrees && (
            <div className="flex items-center justify-between">
              <Label>Corte em 45° (peças pequenas)</Label>
              <Switch checked={useAngles} onCheckedChange={setUseAngles} />
            </div>
          )}

          {/* Reset */}
          <Button variant="ghost" size="sm" onClick={resetDefaults} className="gap-1">
            <RotateCcw className="h-3 w-3" /> Restaurar Padrões
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || !barResults?.length}
            className="gap-1"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exportando...' : 'Exportar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
