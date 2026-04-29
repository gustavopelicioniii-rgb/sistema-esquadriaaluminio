import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import {
  Upload,
  Image,
  FileText,
  Trash2,
  Loader2,
  Package,
  Search,
  Building2,
} from 'lucide-react';

type SupplierFileType = 'perfil' | 'vidro' | 'componente' | 'datasheet';

interface SupplierFile {
  id: string;
  name: string;
  type: SupplierFileType;
  manufacturer: string;
  url: string;
  created_at: string;
}

const MANUFACTURERS = [
  'Aluprime',
  'BFV',
  'Box Inglês',
  'Cemperfil',
  'Deca',
  'Glaster',
  'Gold',
  'Pormade',
  'Suprema',
  'Tamizzi',
  'Termocuil',
];

export function FornecedoresTab() {
  const { user } = useAuth();
  const [files, setFiles] = useState<SupplierFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterManufacturer, setFilterManufacturer] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Dialog state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadManufacturer, setUploadManufacturer] = useState('');
  const [uploadType, setUploadType] = useState<SupplierFileType>('perfil');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  // Upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setUploadPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setUploadPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadName.trim() || !uploadManufacturer || !user) {
      toast.error('Preencha todos os campos');
      return;
    }
    setUploading(true);
    try {
      const ext = uploadFile.name.split('.').pop();
      const path = `suppliers/${user.id}/${uploadManufacturer}/${uploadType}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('supplier-files')
        .upload(path, uploadFile);
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from('supplier-files').getPublicUrl(path);
      const newFile: SupplierFile = {
        id: Date.now().toString(),
        name: uploadName,
        type: uploadType,
        manufacturer: uploadManufacturer,
        url: urlData.publicUrl,
        created_at: new Date().toISOString(),
      };
      setFiles(prev => [newFile, ...prev]);
      toast.success('Arquivo enviado com sucesso!');
      setShowUpload(false);
      setUploadName('');
      setUploadManufacturer('');
      setUploadType('perfil');
      setUploadFile(null);
      setUploadPreview(null);
    } catch (err: any) {
      toast.error('Erro no upload', { description: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (file: SupplierFile) => {
    try {
      const pathToDelete = file.url.split('/supplier-files/')[1];
      if (pathToDelete) {
        await supabase.storage.from('supplier-files').remove([pathToDelete]);
      }
      setFiles(prev => prev.filter(f => f.id !== file.id));
      toast.success('Arquivo removido');
    } catch (err: any) {
      toast.error('Erro ao remover', { description: err.message });
    }
  };

  const filteredFiles = files.filter(f => {
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase());
    const matchManufacturer = filterManufacturer === 'all' || f.manufacturer === filterManufacturer;
    const matchType = filterType === 'all' || f.type === filterType;
    return matchSearch && matchManufacturer && matchType;
  });

  const getTypeLabel = (type: SupplierFileType) => {
    const labels: Record<SupplierFileType, string> = {
      perfil: 'Perfil',
      vidro: 'Vidro',
      componente: 'Componente',
      datasheet: 'Datasheet',
    };
    return labels[type];
  };

  const getTypeIcon = (type: SupplierFileType) => {
    if (type === 'perfil' || type === 'vidro' || type === 'componente') return Image;
    return FileText;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Arquivos de Fornecedores</h2>
          <p className="text-sm text-muted-foreground">
            Upload de imagens e catálogos de fornecedores
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowUpload(true)}>
          <Upload className="h-4 w-4" /> Upload
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar arquivo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterManufacturer} onValueChange={setFilterManufacturer}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Fabricante" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {MANUFACTURERS.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="perfil">Perfil</SelectItem>
            <SelectItem value="vidro">Vidro</SelectItem>
            <SelectItem value="componente">Componente</SelectItem>
            <SelectItem value="datasheet">Datasheet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">Nenhum arquivo enviado</p>
            <p className="text-xs text-muted-foreground mt-1">
              Clique em "Upload" para adicionar arquivos de fornecedores
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map(file => {
            const TypeIcon = getTypeIcon(file.type);
            return (
              <Card key={file.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  {file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <FileText className="h-12 w-12 text-muted-foreground/30" />
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => handleDelete(file)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-3">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> {file.manufacturer}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                      {getTypeLabel(file.type)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload de Arquivo</DialogTitle>
            <DialogDescription>
              Envie imagens ou catálogos de fornecedores.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do arquivo *</Label>
              <Input
                value={uploadName}
                onChange={e => setUploadName(e.target.value)}
                placeholder="Ex: Perfil SU-010 - Seção Transversal"
              />
            </div>
            <div className="space-y-2">
              <Label>Fabricante *</Label>
              <Select value={uploadManufacturer} onValueChange={setUploadManufacturer}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fabricante" />
                </SelectTrigger>
                <SelectContent>
                  {MANUFACTURERS.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de arquivo *</Label>
              <Select
                value={uploadType}
                onValueChange={v => setUploadType(v as SupplierFileType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perfil">Imagem de Perfil</SelectItem>
                  <SelectItem value="vidro">Imagem de Vidro</SelectItem>
                  <SelectItem value="componente">Imagem de Componente</SelectItem>
                  <SelectItem value="datasheet">Datasheet / Catálogo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Arquivo *</Label>
              <Input
                type="file"
                accept="image/*,.pdf,.csv,.txt"
                onChange={handleFileSelect}
              />
            </div>
            {uploadPreview && (
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={uploadPreview}
                  alt="Preview"
                  className="object-contain w-full h-full"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpload(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpload} disabled={uploading || !uploadFile}>
              {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {uploading ? 'Enviando...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
