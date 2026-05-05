'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base — brutalist: no rounding except 2px, uppercase display font, tracked
  'inline-flex items-center justify-center font-display uppercase tracking-wide-display text-sm transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ninja-red focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
  {
    variants: {
      variant: {
        // Primary — bone fill, ink text. The "default action" button.
        primary:
          'bg-bone text-ink hover:bg-bone-dim border border-bone',
        // Critical — ninja-red. Used for destructive or final-step actions.
        critical:
          'bg-ninja-red text-bone hover:bg-ninja-red-hover border border-ninja-red',
        // Outline — bone border, transparent. Default secondary action.
        outline:
          'bg-transparent text-bone border border-bone hover:bg-bone hover:text-ink',
        // Ghost — no border, hover background. For tertiary actions.
        ghost:
          'bg-transparent text-bone hover:bg-ink-shadow border border-transparent',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-5',
        lg: 'h-12 px-7 text-base',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = 'Button';
