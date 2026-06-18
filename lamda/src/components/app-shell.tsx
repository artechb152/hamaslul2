import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090914]/70 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-md">
          <span className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.08] text-[#8beeff]">
            <Sparkles size={18} aria-hidden="true" />
          </span>
          <span className="text-xl font-semibold tracking-normal">למדא</span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto text-sm text-white/60">
          <NavLink href="/templates">תבניות</NavLink>
          <NavLink href="/library">ספרייה</NavLink>
          <NavLink href="/create">בונה</NavLink>
          <NavLink href="/results">תוצאות</NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring whitespace-nowrap rounded-md px-3 py-2 transition hover:bg-white/[0.08] hover:text-white"
    >
      {children}
    </Link>
  );
}

export function AppFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#05050b] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 text-sm text-white/55 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-white">למדא</p>
          <p>מערכי שיעור, תבניות וספריית תוכן מקומית בעברית.</p>
        </div>
      </div>
    </footer>
  );
}
