import { useRef, useCallback, type TouchEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const navOrder = ["/", "/orcamentos", "/producao", "/financeiro", "/relatorios"];

const SWIPE_THRESHOLD = 80;
const SWIPE_MAX_Y = 60;

export function useSwipeNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const startX = useRef(0);
  const startY = useRef(0);

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!isMobile) return;
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    },
    [isMobile]
  );

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!isMobile) return;
      const dx = e.changedTouches[0].clientX - startX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - startY.current);

      if (dy > SWIPE_MAX_Y || Math.abs(dx) < SWIPE_THRESHOLD) return;

      const currentIndex = navOrder.indexOf(location.pathname);
      if (currentIndex === -1) return;

      if (dx < 0 && currentIndex < navOrder.length - 1) {
        navigate(navOrder[currentIndex + 1]);
      } else if (dx > 0 && currentIndex > 0) {
        navigate(navOrder[currentIndex - 1]);
      }
    },
    [isMobile, location.pathname, navigate]
  );

  return { onTouchStart, onTouchEnd };
}
