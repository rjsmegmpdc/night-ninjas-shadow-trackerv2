import { cn } from '@/lib/utils';

/**
 * Night Ninjas wordmark — text only, paired with Logo or stacked.
 *
 * Variants:
 *   default: full lockup with `est. 2016` baseline
 *   compact: just the wordmark (for nav, tight spaces)
 */
export function Wordmark({
  className,
  variant = 'default',
}: {
  className?: string;
  variant?: 'default' | 'compact';
}) {
  return (
    <div className={cn('flex flex-col leading-none', className)}>
      <span className="font-display tracking-wide-display text-2xl">
        NIGHT NINJAS
      </span>
      {variant === 'default' && (
        <span className="font-mono text-[10px] text-bone-mute mt-0.5 tracking-widest">
          shadow tracker · est. 2016
        </span>
      )}
    </div>
  );
}
