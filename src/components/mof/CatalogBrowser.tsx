import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, Filter, Package, Grid3x3, List, ChevronRight, 
  Scale, Ruler, Palette, Info, ExternalLink, Check
} from "lucide-react";
import {
  allSupplierProfiles,
  supplierGlasses,
  supplierComponents,
  getAllLines,
  getProfilesByLine,
  getComponentsByType,
  type SupplierProfile,
  type SupplierGlass,
  type SupplierComponent,
} from "@/data/catalog/suppliers";

interface CatalogBrowserProps {
  onSelectProfile?: (profile: SupplierProfile) => void;
  onSelectGlass?: (glass: SupplierGlass) => void;
  onSelectComponent?: (component: SupplierComponent) => void;
  selectedProfileId?: string;
  selectedGlassId?: string;
  selectedComponentId?: string;
}

export function CatalogBrowser({
  onSelectProfile,
  onSelectGlass,
  onSelectComponent,
  selectedProfileId,
  selectedGlassId,
  selectedComponentId,
}: CatalogBrowserProps) {
  const [search, setSearch] = useState("");
  const [selectedLine, setSelectedLine] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [detailProfile, setDetailProfile] = useState<SupplierProfile | null>(null);

  const lines = useMemo(() => getAllLines(), []);

  const filteredProfiles = useMemo(() => {
    let profiles = selectedLine === "all" ? allSupplierProfiles : getProfilesByLine(selectedLine);
    
    if (search) {
      const searchLower = search.toLowerCase();
      profiles = profiles.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.code.toLowerCase().includes(searchLower) ||
        p.manufacturer.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    if (selectedType !== "all") {
      profiles = profiles.filter(p => p.profile_type === selectedType);
    }

    return profiles;
  }, [selectedLine, search, selectedType]);

  const filteredGlasses = useMemo(() => {
    if (search) {
      const searchLower = search.toLowerCase();
      return supplierGlasses.filter(g => 
        g.name.toLowerCase().includes(searchLower) ||
        g.manufacturer.toLowerCase().includes(searchLower)
      );
    }
    return supplierGlasses;
  }, [search]);

  const filteredComponents = useMemo(() => {
    let comps = selectedType === "all" ? supplierComponents : getComponentsByType(selectedType);
    
    if (search) {
      const searchLower = search.toLowerCase();
      comps = comps.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.code.toLowerCase().includes(searchLower) ||
        c.manufacturer.toLowerCase().includes(searchLower)
      );
    }
    return comps;
  }, [search, selectedType]);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      pingadeira: "Pingadeira",
      guideline: "Guideline",
      main_frame: "Batente",
      main_frame_60: "Batente 60",
      veneziana: "Veneziana",
      complementar: "Complementar",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      pingadeira: "bg-blue-100 text-blue-800",
      guideline: "bg-green-100 text-green-800",
      main_frame: "bg-purple-100 text-purple-800",
      main_frame_60: "bg-purple-100 text-purple-800",
      veneziana: "bg-amber-100 text-amber-800",
      complementar: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar perfil, vidro ou componente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={selectedLine}
          onChange={(e) => setSelectedLine(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Todas as Linhas</option>
          {lines.map((l) => (
            <option key={`${l.manufacturer}-${l.line}`} value={l.line}>
              {l.manufacturer} - {l.line}
            </option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Todos os Tipos</option>
          <option value="pingadeira">Pingadeira</option>
          <option value="guideline">Guideline</option>
          <option value="main_frame">Batente</option>
          <option value="main_frame_60">Batente 60</option>
          <option value="veneziana">Veneziana</option>
        </select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profiles" className="w-full">
        <TabsList>
          <TabsTrigger value="profiles" className="gap-2">
            <Package className="h-4 w-4" />
            Perfis ({filteredProfiles.length})
          </TabsTrigger>
          <TabsTrigger value="glasses" className="gap-2">
            <Palette className="h-4 w-4" />
            Vidros ({filteredGlasses.length})
          </TabsTrigger>
          <TabsTrigger value="components" className="gap-2">
            <Filter className="h-4 w-4" />
            Componentes ({filteredComponents.length})
          </TabsTrigger>
        </TabsList>

        {/* Profiles Tab */}
        <TabsContent value="profiles" className="mt-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProfiles.map((profile) => (
                <Card 
                  key={profile.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedProfileId === profile.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => {
                    onSelectProfile?.(profile);
                    setDetailProfile(profile);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{profile.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{profile.code}</p>
                      </div>
                      {selectedProfileId === profile.id && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {profile.weight_kg_m.toFixed(2)} kg/m
                      </Badge>
                      <Badge className={`text-xs ${getTypeColor(profile.profile_type)}`}>
                        {getTypeLabel(profile.profile_type)}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Ruler className="h-3 w-3" />
                      <span>{profile.width_mm}x{profile.height_mm}mm</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Fabricante</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Peso (kg/m)</TableHead>
                    <TableHead className="text-right">Dimensões</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => (
                    <TableRow 
                      key={profile.id}
                      className={`cursor-pointer ${selectedProfileId === profile.id ? "bg-primary/5" : ""}`}
                      onClick={() => onSelectProfile?.(profile)}
                    >
                      <TableCell className="font-mono text-xs">{profile.code}</TableCell>
                      <TableCell className="font-medium text-sm">{profile.name}</TableCell>
                      <TableCell className="text-sm">{profile.manufacturer}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(profile.profile_type)}>
                          {getTypeLabel(profile.profile_type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{profile.weight_kg_m.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-sm">
                        {profile.width_mm}x{profile.height_mm}mm
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Glasses Tab */}
        <TabsContent value="glasses" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredGlasses.map((glass) => (
              <Card 
                key={glass.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedGlassId === glass.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => onSelectGlass?.(glass)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{glass.name}</p>
                      <p className="text-xs text-muted-foreground">{glass.manufacturer}</p>
                    </div>
                    {selectedGlassId === glass.id && (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {glass.thickness_mm}mm
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {glass.type}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Preço/m²</span>
                    <span className="font-semibold text-primary">
                      R$ {glass.price_m2.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredComponents.map((comp) => (
              <Card 
                key={comp.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedComponentId === comp.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => onSelectComponent?.(comp)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{comp.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{comp.code}</p>
                    </div>
                    {selectedComponentId === comp.id && (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {comp.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {comp.unit}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Preço</span>
                    <span className="font-semibold text-primary">
                      R$ {comp.price.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={!!detailProfile} onOpenChange={() => setDetailProfile(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{detailProfile?.name}</DialogTitle>
          </DialogHeader>
          {detailProfile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Código</p>
                  <p className="font-mono">{detailProfile.code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fabricante</p>
                  <p>{detailProfile.manufacturer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Linha</p>
                  <p>{detailProfile.line}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <Badge className={getTypeColor(detailProfile.profile_type)}>
                    {getTypeLabel(detailProfile.profile_type)}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Scale className="h-4 w-4" /> Especificações Técnicas
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Peso</p>
                    <p className="font-medium">{detailProfile.weight_kg_m.toFixed(3)} kg/m</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Comprimento</p>
                    <p className="font-medium">{detailProfile.standard_mm} mm</p>
                  </div>
                  {detailProfile.thickness_mm && (
                    <div>
                      <p className="text-muted-foreground">Espessura</p>
                      <p className="font-medium">{detailProfile.thickness_mm} mm</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Largura</p>
                    <p className="font-medium">{detailProfile.width_mm} mm</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Altura</p>
                    <p className="font-medium">{detailProfile.height_mm} mm</p>
                  </div>
                  {detailProfile.inertia_x && (
                    <div>
                      <p className="text-muted-foreground">Inércia X</p>
                      <p className="font-medium">{detailProfile.inertia_x} cm⁴</p>
                    </div>
                  )}
                  {detailProfile.inertia_y && (
                    <div>
                      <p className="text-muted-foreground">Inércia Y</p>
                      <p className="font-medium">{detailProfile.inertia_y} cm⁴</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Acabamentos Disponíveis</p>
                <div className="flex flex-wrap gap-1">
                  {detailProfile.color_finishes.map((color) => (
                    <Badge key={color} variant="outline" className="capitalize">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{detailProfile.description}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
