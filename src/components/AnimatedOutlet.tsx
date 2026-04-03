import { useEffect, useState, useRef, cloneElement, isValidElement } from "react";
import { useLocation, useOutlet } from "react-router-dom";

export function AnimatedOutlet({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const outlet = useOutlet();
  const content = children || outlet;
  
  const [displayContent, setDisplayContent] = useState(content);
  const [stage, setStage] = useState<"enter" | "exit">("enter");
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      setStage("exit");
    }
  }, [location.pathname]);

  // Keep displayContent in sync when not transitioning
  useEffect(() => {
    if (stage === "enter") {
      setDisplayContent(content);
    }
  }, [content, stage]);

  const handleAnimationEnd = () => {
    if (stage === "exit") {
      prevPath.current = location.pathname;
      setDisplayContent(content);
      setStage("enter");
    }
  };

  return (
    <div
      className={stage === "enter" ? "page-enter" : "page-exit"}
      onAnimationEnd={handleAnimationEnd}
    >
      {displayContent}
    </div>
  );
}
