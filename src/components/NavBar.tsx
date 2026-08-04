import Link from "next/link";
import { CLASS_NAME } from "@/lib/constants";

export default function NavBar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-extrabold text-slate-800">
          Camille &amp; Scott&apos;s Baby Pool
          <span className="ml-2 hidden text-xs font-normal text-slate-400 sm:inline">
            {CLASS_NAME}
          </span>
        </Link>
        <nav className="flex gap-4 text-sm font-semibold text-slate-600">
          <Link href="/" className="hover:text-emerald-600">
            Story
          </Link>
          <Link href="/pool" className="hover:text-emerald-600">
            Enter the Pool
          </Link>
        </nav>
      </div>
    </header>
  );
}
