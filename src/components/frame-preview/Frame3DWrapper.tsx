import { useRef, useState, useCallback, type ReactNode } from 'react';

interface Frame3DWrapperProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function Frame3DWrapper({
  children,
  className = '',
  disabled = false,
}: Frame3DWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const maxRotation = 20;
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * maxRotation;
      const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * maxRotation;
      setRotation({
        x: Math.max(-maxRotation, Math.min(maxRotation, rotateX)),
        y: Math.max(-maxRotation, Math.min(maxRotation, rotateY)),
      });
    },
    [disabled]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  }, []);

  return (
    <div className={`${className}`} style={{ perspective: '800px' }}>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
          cursor: disabled ? 'default' : 'grab',
        }}
      >
        {/* Subtle shadow that shifts with rotation */}
        <div
          className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at ${50 - rotation.y}% ${50 - rotation.x}%, transparent 30%, rgba(0,0,0,0.15) 100%)`,
            transform: 'translateZ(-2px)',
          }}
        />
        {children}
      </div>
    </div>
  );
}
