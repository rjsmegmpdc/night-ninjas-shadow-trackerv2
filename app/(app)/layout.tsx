import { TopNav } from '@/components/nav/topnav';
import { RouteFocus } from '@/components/nav/route-focus';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-ink-panel focus:text-bone focus:border focus:border-accent focus:rounded-lg focus:text-sm"
      >
        Skip to content
      </a>
      <RouteFocus />
      <TopNav />
      <main id="main-content" className="min-w-0">{children}</main>
    </div>
  );
}
