import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

export function AnimatedOutlet({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<"enter" | "exit">("enter");
  const prevKey = useRef(location.key);

  useEffect(() => {
    if (location.key !== prevKey.current) {
      setTransitionStage("exit");
    }
  }, [location.key, children]);

  const handleTransitionEnd = () => {
    if (transitionStage === "exit") {
      prevKey.current = location.key;
      setDisplayChildren(children);
      setTransitionStage("enter");
    }
  };

  return (
    <div
      className={transitionStage === "enter" ? "page-enter" : "page-exit"}
      onAnimationEnd={handleTransitionEnd}
    >
      {displayChildren}
    </div>
  );
}
