import { useLocation, useOutlet } from "react-router-dom";

export function AnimatedOutlet({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const outlet = useOutlet();
  const content = children ?? outlet;

  return (
    <div key={location.pathname} className="page-enter">
      {content}
    </div>
  );
}
