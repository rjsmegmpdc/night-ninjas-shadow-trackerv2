'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Flame, User, Activity, Dumbbell, BarChart2, SlidersHorizontal, Menu, X } from 'lucide-react';
import { Wordmark } from '@/components/brand/wordmark';
import { cn } from '@/lib/utils';

/**
 * TopNav - VELOCITY's primary navigation.
 *
 * Four buckets (icon + label):
 *   Dashboard   -> /patrol
 *   Training    -> /dojo, /calendar
 *   Analytics   -> /strike, /recon
 *   Profile     -> /settings, /help, /shoes, /journal
 *
 * Desktop: horizontal bar. Mobile (<sm): hamburger → dropdown panel.
 * Touch targets meet 44px minimum (py-3). Active items get bg-accent-faint.
 */

interface NavBucket {
  label: string;
  href: string;
  match: string[];
  icon: React.ElementType;
}

const NAV: NavBucket[] = [
  { label: 'Dashboard', href: '/patrol',   match: ['/patrol'],                                  icon: Activity },
  { label: 'Training',  href: '/dojo',     match: ['/dojo', '/calendar'],                       icon: Dumbbell },
  { label: 'Analytics', href: '/strike',   match: ['/strike', '/recon'],                        icon: BarChart2 },
  { label: 'Profile',   href: '/settings', match: ['/settings', '/help', '/shoes', '/journal'], icon: SlidersHorizontal },
];

export function TopNav() {
  const pathname = usePathname() ?? '';
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-sm border-b border-ink-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">

        {/* Wordmark */}
        <Link href="/patrol" aria-label="VELOCITY — go to dashboard" className="shrink-0">
          <Wordmark variant="accent" size="nav" />
        </Link>

        {/* Centre nav — desktop only */}
        <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-2">
          {NAV.map(({ label, href, match, icon: Icon }) => {
            const active = match.some((m) => pathname.startsWith(m));
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-lg font-sans text-sm transition-colors duration-150 cursor-pointer',
                  active
                    ? 'text-accent bg-accent-faint'
                    : 'text-bone-dim hover:text-bone hover:bg-ink-shadow'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label="Streak"
            className="flex items-center gap-1.5 px-2.5 py-3 rounded-lg text-bone-dim hover:text-accent active:opacity-80 transition-colors cursor-pointer"
          >
            <Flame size={18} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Profile"
            className="w-9 h-9 rounded-full bg-ink-panel border border-ink-line flex items-center justify-center text-bone-dim hover:text-bone hover:border-ink-line-bold active:opacity-80 transition-colors cursor-pointer"
          >
            <User size={16} strokeWidth={1.5} />
          </button>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg text-bone-dim hover:text-bone hover:bg-ink-shadow active:opacity-80 transition-colors cursor-pointer"
          >
            {mobileOpen
              ? <X size={20} strokeWidth={1.5} />
              : <Menu size={20} strokeWidth={1.5} />
            }
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="sm:hidden border-t border-ink-line bg-ink px-4 py-2 space-y-1"
        >
          {NAV.map(({ label, href, match, icon: Icon }) => {
            const active = match.some((m) => pathname.startsWith(m));
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg font-sans text-sm transition-colors duration-150 cursor-pointer',
                  active
                    ? 'text-accent bg-accent-faint'
                    : 'text-bone-dim hover:text-bone hover:bg-ink-shadow'
                )}
              >
                <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
