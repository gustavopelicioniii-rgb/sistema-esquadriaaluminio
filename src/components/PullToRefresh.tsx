import { useState, useRef, useCallback, type ReactNode } from "react";
import { Loader2, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile-device";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  className?: string;
}

export function PullToRefresh({ onRefresh, children, className }: PullToRefreshProps) {
  const isMobile = useIsMobile();
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const threshold = 80;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile || refreshing) return;
    const el = containerRef.current;
    if (el && el.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  }, [isMobile, refreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling || refreshing) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      setPullDistance(Math.min(delta * 0.5, 120));
    }
  }, [pulling, refreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling) return;
    setPulling(false);
    if (pullDistance >= threshold) {
      setRefreshing(true);
      setPullDistance(threshold * 0.5);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pulling, pullDistance, onRefresh]);

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-[height] duration-200"
        style={{ height: pullDistance > 0 ? pullDistance : 0 }}
      >
        {refreshing ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <ArrowDown
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-200",
              progress >= 1 && "text-primary rotate-180"
            )}
            style={{ transform: `rotate(${progress * 180}deg)` }}
          />
        )}
      </div>
      {children}
    </div>
  );
}
