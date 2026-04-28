import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile-device';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';

export type ResponsiveDialogSize = 'sm' | 'md' | 'lg';

interface ResponsiveDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  size?: ResponsiveDialogSize;
  className?: string;
}

const sizeClasses: Record<ResponsiveDialogSize, { desktop: string; mobile: string }> = {
  sm: {
    desktop: 'max-w-md',
    mobile: 'max-h-[85vh]',
  },
  md: {
    desktop: 'max-w-2xl',
    mobile: 'max-h-[90vh]',
  },
  lg: {
    desktop: 'max-w-4xl',
    mobile: 'max-h-[95vh]',
  },
};

/**
 * ResponsiveDialog - Dialog on desktop, Drawer on mobile
 *
 * Usage:
 * <ResponsiveDialog open={open} onOpenChange={setOpen} size="md">
 *   <DialogHeader>
 *     <DialogTitle>Título</DialogTitle>
 *     <DialogDescription>Descrição</DialogDescription>
 *   </DialogHeader>
 *   {children}
 *   <DialogFooter>...</DialogFooter>
 * </ResponsiveDialog>
 */
export function ResponsiveDialog({
  open = false,
  onOpenChange,
  children,
  size = 'md',
  className,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();
  const classes = sizeClasses[size];

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className={cn(classes.mobile, 'max-w-full', className)}>
          <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-muted" />
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(classes.desktop, className)}>{children}</DialogContent>
    </Dialog>
  );
}

// Header component for mobile-friendly headers
export function ResponsiveDialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerHeader className={className} {...props} />;
  }

  return <DialogHeader className={className} {...props} />;
}

// Title component
export function ResponsiveDialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerTitle className={className} {...props} />;
  }

  return <DialogTitle className={className} {...props} />;
}

// Description component
export function ResponsiveDialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerDescription className={className} {...props} />;
  }

  return <DialogDescription className={className} {...props} />;
}

// Footer component
export function ResponsiveDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerFooter className={className} {...props} />;
  }

  return <DialogFooter className={className} {...props} />;
}

// Close button component (useful for mobile)
export function ResponsiveDialogClose({
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { onClick?: () => void }) {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute right-4 top-4 rounded-full p-2 opacity-70 ring-offset-background transition-all',
        'hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'touch-manipulation',
        className
      )}
      {...props}
    >
      <X className="h-5 w-5" />
      <span className="sr-only">Fechar</span>
    </button>
  );
}
