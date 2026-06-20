'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { User, UserCircle, Settings, HelpCircle, type LucideIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';

/**
 * R1 polish - avatar dropdown. Replaces the previously-static avatar button.
 * Interactive (JS) menu - the CSS-only HoverCard can't host links/toggles.
 * Closes on outside-click and Escape.
 */

export function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-ink-panel border border-ink-line flex items-center justify-center text-bone-dim hover:text-bone hover:border-ink-line-bold transition-colors"
      >
        <User size={16} strokeWidth={1.5} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-ink-line bg-ink-panel shadow-card py-1 z-50">
          <MenuLink href="/profile" icon={UserCircle} label="Profile" onClick={() => setOpen(false)} />
          <MenuLink href="/settings" icon={Settings} label="Settings" onClick={() => setOpen(false)} />
          <MenuLink href="/help" icon={HelpCircle} label="Help" onClick={() => setOpen(false)} />
          <div className="flex items-center justify-between px-3 py-1.5 border-t border-ink-line mt-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-bone-mute">theme</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href, icon: Icon, label, onClick,
}: { href: string; icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 text-sm text-bone-dim hover:text-bone hover:bg-ink-shadow transition-colors"
    >
      <Icon size={15} strokeWidth={1.5} />
      {label}
    </Link>
  );
}
