import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

export function AnimatedOutlet({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<"enter" | "exit">("enter");
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      setTransitionStage("exit");
    }
  }, [location.pathname]);

  // Update children ref when they change (for same-path re-renders)
  useEffect(() => {
    if (transitionStage === "enter") {
      setDisplayChildren(children);
    }
  }, [children, transitionStage]);

  const handleAnimationEnd = () => {
    if (transitionStage === "exit") {
      prevPath.current = location.pathname;
      setDisplayChildren(children);
      setTransitionStage("enter");
    }
  };

  return (
    <div
      key={transitionStage + prevPath.current}
      className={transitionStage === "enter" ? "page-enter" : "page-exit"}
      onAnimationEnd={handleAnimationEnd}
    >
      {displayChildren}
    </div>
  );
}
