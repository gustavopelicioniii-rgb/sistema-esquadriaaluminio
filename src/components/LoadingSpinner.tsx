import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const dotCount = 8;
  const sizeMap = { sm: 24, md: 40, lg: 56 };
  const dotSizeMap = { sm: 3, md: 5, lg: 7 };
  const s = sizeMap[size];
  const ds = dotSizeMap[size];
  const r = (s - ds) / 2;

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        className="animate-spin"
        style={{ animationDuration: '1s' }}
      >
        {Array.from({ length: dotCount }).map((_, i) => {
          const angle = (i * 360) / dotCount - 90;
          const rad = (angle * Math.PI) / 180;
          const cx = s / 2 + r * Math.cos(rad);
          const cy = s / 2 + r * Math.sin(rad);
          // Opacity gradient: last dot is darkest
          const opacity = 0.15 + (i / (dotCount - 1)) * 0.85;
          return <circle key={i} cx={cx} cy={cy} r={ds / 2} fill={`rgba(0, 0, 0, ${opacity})`} />;
        })}
      </svg>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  );
}
