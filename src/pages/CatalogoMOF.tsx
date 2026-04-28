import { usePageTitle } from '@/hooks/use-page-title';
import { CatalogBrowser } from '@/components/mof/CatalogBrowser';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, Palette, Filter, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  allSupplierProfiles,
  supplierGlasses,
  supplierComponents,
  getAllManufacturers,
} from '@/data/catalog/suppliers';

export default function CatalogoMOF() {
  usePageTitle('Catálogo MOF');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const manufacturers = getAllManufacturers();

  const handleExportCatalog = () => {
    const catalog = {
      generatedAt: new Date().toISOString(),
      manufacturers,
      profiles: allSupplierProfiles.length,
      glasses: supplierGlasses.length,
      components: supplierComponents.length,
      data: {
        profiles: allSupplierProfiles,
        glasses: supplierGlasses,
        components: supplierComponents,
      },
    };

    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mof-catalog-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Catálogo exportado com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Catálogo MOF</h1>
          <p className="text-muted-foreground">
            Mídia Oficial do Fornecedor - Biblioteca completa de perfis, vidros e componentes
          </p>
        </div>
        <Button onClick={handleExportCatalog} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Catálogo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allSupplierProfiles.length}</p>
                <p className="text-xs text-muted-foreground">Perfis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Palette className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{supplierGlasses.length}</p>
                <p className="text-xs text-muted-foreground">Vãos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Filter className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{supplierComponents.length}</p>
                <p className="text-xs text-muted-foreground">Componentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <ExternalLink className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{manufacturers.length}</p>
                <p className="text-xs text-muted-foreground">Fabricantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manufacturers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fabricantes Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {manufacturers.map(m => (
              <Badge key={m} variant="outline" className="px-3 py-1">
                {m}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Catalog Browser */}
      <Card>
        <CardContent className="pt-6">
          <CatalogBrowser
            onSelectProfile={profile => {
              setSelectedProfile(profile);
              toast.success(`Perfil selecionado: ${profile.name}`);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
