'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  ScanEye,
  Trophy,
  Swords,
  CalendarDays,
  ClipboardList,
  Settings,
} from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Patrol', href: '/patrol', icon: Activity, hint: 'this week' },
  { label: 'Recon', href: '/recon', icon: ScanEye, hint: 'compliance' },
  { label: 'Strike', href: '/strike', icon: Trophy, hint: 'best week' },
  { label: 'Dojo', href: '/dojo', icon: Swords, hint: 'plan' },
  { label: 'Calendar', href: '/calendar', icon: CalendarDays, hint: 'races · life' },
  { label: 'Journal', href: '/journal', icon: ClipboardList, hint: 'wellness' },
  { label: 'Settings', href: '/settings', icon: Settings, hint: 'config' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 border-r border-ink-line bg-ink h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-6 border-b border-ink-line flex items-center gap-3">
        <Logo size={28} />
        <div className="leading-none">
          <div className="font-display text-lg tracking-wide-display">
            NIGHT NINJAS
          </div>
          <div className="font-mono text-[9px] text-bone-mute tracking-widest uppercase mt-0.5">
            shadow tracker
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {NAV.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-5 py-3 transition-colors duration-150',
                'border-l-2',
                active
                  ? 'bg-ink-shadow border-ninja-red text-bone'
                  : 'border-transparent text-bone-dim hover:text-bone hover:bg-ink-shadow'
              )}
            >
              <Icon size={18} strokeWidth={1.5} />
              <div className="flex flex-col leading-none">
                <span className="font-display tracking-wide-display text-sm uppercase">
                  {item.label}
                </span>
                <span className="font-mono text-[9px] text-bone-mute mt-1 uppercase tracking-widest">
                  {item.hint}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-ink-line">
        <div className="font-mono text-[10px] text-bone-mute leading-relaxed">
          local · v0.1.0<br />
          <span className="text-bone-dim">est. 2016</span>
        </div>
      </div>
    </aside>
  );
}
