'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ButtonProps } from '@/components/ui/button';

interface FormSubmitButtonProps extends Omit<ButtonProps, 'type'> {
  pendingLabel?: string;
}

/**
 * Drop-in replacement for <Button type="submit"> inside a <form>.
 * Disables itself and shows a spinner while the form action is pending.
 */
export function FormSubmitButton({
  children,
  pendingLabel,
  className,
  variant,
  size,
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={pending}
      aria-disabled={pending}
      className={cn(className)}
      {...props}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
          {pendingLabel ?? children}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
