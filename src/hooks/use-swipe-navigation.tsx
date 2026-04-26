import { useRef, useCallback, type TouchEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile-device";

const navOrder = ["/", "/orcamentos", "/producao", "/financeiro", "/relatorios"];

const SWIPE_THRESHOLD = 80;
const SWIPE_MAX_Y = 60;
const SWIPE_IGNORE_SELECTOR = [
  "button",
  "a",
  "input",
  "textarea",
  "select",
  "label",
  "[role='button']",
  "[data-swipe-ignore='true']",
  "[data-radix-scroll-area-viewport]",
].join(", ");

const shouldIgnoreSwipe = (target: EventTarget | null) =>
  target instanceof Element && Boolean(target.closest(SWIPE_IGNORE_SELECTOR));

export function useSwipeNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const startX = useRef(0);
  const startY = useRef(0);
  const ignoreSwipe = useRef(false);

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!isMobile) return;
      ignoreSwipe.current = shouldIgnoreSwipe(e.target);
      if (ignoreSwipe.current) return;
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    },
    [isMobile]
  );

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!isMobile) return;
      const shouldSkip = ignoreSwipe.current;
      ignoreSwipe.current = false;
      if (shouldSkip) return;

      const dx = e.changedTouches[0].clientX - startX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - startY.current);
      const absDx = Math.abs(dx);

      if (dy > SWIPE_MAX_Y || absDx < SWIPE_THRESHOLD || absDx <= dy) return;

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
