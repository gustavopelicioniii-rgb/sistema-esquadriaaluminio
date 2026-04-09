import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Camera, X, Loader2, ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Foto {
  id: string;
  foto_url: string; // storage path
  nome_arquivo: string | null;
  created_at: string;
  signedUrl?: string; // resolved signed URL for display
}

interface Props {
  pedidoId: string;
  etapaId: string;
}

export default function ChecklistPhotos({ pedidoId, etapaId }: Props) {
  const { user } = useAuth();
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFotos();
  }, [pedidoId, etapaId]);

  const resolveSignedUrls = async (items: Foto[]): Promise<Foto[]> => {
    const results = await Promise.all(
      items.map(async (foto) => {
        // If foto_url is already an absolute URL (legacy data), use it directly
        if (foto.foto_url.startsWith("http")) {
          return { ...foto, signedUrl: foto.foto_url };
        }
        const { data } = await supabase.storage
          .from("checklist-fotos")
          .createSignedUrl(foto.foto_url, 60 * 60); // 1 hour
        return { ...foto, signedUrl: data?.signedUrl || "" };
      })
    );
    return results;
  };

  const fetchFotos = async () => {
    const { data } = await supabase
      .from("pedido_checklist_fotos")
      .select("*")
      .eq("pedido_id", pedidoId)
      .eq("etapa", etapaId)
      .order("created_at", { ascending: false });

    const raw = (data as any[]) || [];
    const resolved = await resolveSignedUrls(raw);
    setFotos(resolved);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${user?.id}/${pedidoId}/${etapaId}/${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("checklist-fotos")
        .upload(path, file);

      if (uploadErr) {
        toast({ title: "Erro no upload", description: uploadErr.message, variant: "destructive" });
        continue;
      }

      await supabase.from("pedido_checklist_fotos").insert({
        pedido_id: pedidoId,
        etapa: etapaId,
        foto_url: path,
        nome_arquivo: file.name,
      } as any);
    }

    setUploading(false);
    setExpanded(true);
    fetchFotos();
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = async (foto: Foto) => {
    // Use stored path directly for private bucket
    const storagePath = foto.foto_url.startsWith("http")
      ? foto.foto_url.split("/checklist-fotos/")[1]
        ? decodeURIComponent(foto.foto_url.split("/checklist-fotos/")[1])
        : null
      : foto.foto_url;

    if (storagePath) {
      await supabase.storage.from("checklist-fotos").remove([storagePath]);
    }
    await supabase.from("pedido_checklist_fotos").delete().eq("id", foto.id);
    setFotos((prev) => prev.filter((f) => f.id !== foto.id));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          Fotos ({fotos.length})
        </button>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            {uploading ? "Enviando..." : "Adicionar foto"}
          </Button>
        </div>
      </div>

      {expanded && fotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {fotos.map((foto) => (
            <div key={foto.id} className="relative group rounded-lg overflow-hidden border bg-muted aspect-square">
              <img
                src={foto.signedUrl || ""}
                alt={foto.nome_arquivo || "Foto"}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleDelete(foto)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              {foto.nome_arquivo && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 truncate">
                  {foto.nome_arquivo}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
