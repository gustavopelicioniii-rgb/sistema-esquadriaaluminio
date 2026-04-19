import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// TEMPORARILY DISABLED - PWA install banner removed
export function PwaInstallBanner() {
  return null;
  
  // Original code disabled below
  /*
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem("pwa-install-dismissed")) return;
    if (!isMobile) return;

    const ua = navigator.userAgent;
    const isIosDevice = /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream;
    setIsIos(isIosDevice);

    if (isIosDevice) {
      setShowBanner(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isMobile]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed", "1");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 z-50 animate-in slide-in-from-bottom-4 duration-500 sm:hidden">
      <div className="bg-primary text-primary-foreground rounded-xl p-4 shadow-lg flex items-start gap-3">
        <Download className="h-6 w-6 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Instalar AluFlow</p>
          <p className="text-xs opacity-90 mt-0.5">
            {isIos
              ? "Toque em Compartilhar (⬆) e depois \"Adicionar à Tela Inicial\"."
              : "Adicione à tela inicial para acesso rápido e offline."}
          </p>
          {!isIos && (
            <Button
              size="sm"
              variant="secondary"
              className="mt-2 h-8 text-xs"
              onClick={handleInstall}
            >
              Instalar agora
            </Button>
          )}
        </div>
        <button onClick={handleDismiss} className="shrink-0 opacity-70 hover:opacity-100">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
  */
}
