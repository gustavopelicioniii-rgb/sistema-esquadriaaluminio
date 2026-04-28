import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TypologyCard3DProps {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  dimensions?: { largura: number; altura: number };
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function TypologyCard3D({
  id,
  name,
  imageUrl,
  category,
  dimensions,
  selected = false,
  onClick,
  className,
}: TypologyCard3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [rotateY, setRotateY] = useState(0);
  const [rotateX, setRotateX] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = ((centerY - y) / centerY) * 10;
    setRotateY(rotateY);
    setRotateX(rotateX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setRotateY(0);
    setRotateX(0);
  };

  return (
    <div
      className={cn(
        'relative cursor-pointer perspective-1000',
        selected && 'ring-2 ring-primary',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseUp();
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={handleMouseUp}
      onClick={onClick}
    >
      {/* Card container */}
      <div
        className={cn(
          'relative bg-card rounded-xl overflow-hidden transition-all duration-300 ease-out',
          'transform-style-3d preserve-3d',
          isHovered && !isDragging && 'scale-[1.02] shadow-xl',
          selected && 'ring-2 ring-primary shadow-lg'
        )}
        style={{
          transform: `
            rotateY(${rotateY}deg)
            rotateX(${rotateX}deg)
            ${isHovered && !isDragging ? 'translateZ(20px)' : ''}
          `,
          transition: isDragging ? 'none' : 'all 0.3s ease-out',
        }}
      >
        {/* Image container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className={cn(
                'w-full h-full object-cover transition-transform duration-500',
                isHovered && !isDragging && 'scale-110'
              )}
              style={{
                transform: isDragging
                  ? `rotateY(${rotateY * 0.5}deg) rotateX(${-rotateX * 0.5}deg)`
                  : isHovered
                    ? 'scale(1.1)'
                    : 'scale(1)',
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-4xl font-bold text-primary/40">{name.charAt(0)}</span>
            </div>
          )}

          {/* Reflection overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"
            style={{
              backgroundPosition: 'top left',
              backgroundSize: '100% 100%',
            }}
          />

          {/* Glass overlay on hover */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent',
              'opacity-0 transition-opacity duration-300',
              isHovered && 'opacity-100'
            )}
          />

          {/* Category badge */}
          <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-xs font-medium text-white">
            {category}
          </div>

          {/* 3D indicator */}
          <div
            className={cn(
              'absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md',
              'text-xs font-medium text-white transition-all duration-300',
              isHovered && 'opacity-100'
            )}
          >
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>3D</span>
          </div>
        </div>

        {/* Info section */}
        <div className="p-4 bg-card">
          <h3 className="font-semibold text-sm line-clamp-1">{name}</h3>
          {dimensions && (
            <p className="text-xs text-muted-foreground mt-1">
              {dimensions.largura} × {dimensions.altura} mm
            </p>
          )}
        </div>

        {/* Selected indicator */}
        {selected && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-primary-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>

      {/* Shadow */}
      <div
        className={cn(
          'absolute -bottom-4 left-4 right-4 h-4 bg-black/20 rounded-full blur-sm',
          'transition-all duration-300',
          isHovered && !isDragging && '-bottom-6 opacity-50'
        )}
        style={{
          transform: `translateZ(-20px)`,
        }}
      />
    </div>
  );
}
