import Link from "next/link";
import { CLASS_NAME } from "@/lib/constants";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--navy)]/20 bg-[var(--navy)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--gold)] font-mono text-xs font-bold text-[var(--cream)]">
            C&amp;S
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-base font-bold italic text-[var(--cream)]">
              Camille &amp; Scott
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-[var(--gold)] sm:inline">
              {CLASS_NAME}
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-5 font-mono text-xs font-semibold uppercase tracking-widest text-[var(--cream)]/80">
          <Link href="/" className="hover:text-[var(--gold)]">
            Story
          </Link>
          <Link href="/pool" className="btn-pill rounded-full px-4 py-2">
            Enter the Pool
          </Link>
        </nav>
      </div>
    </header>
  );
}
