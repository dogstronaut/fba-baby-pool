import Link from "next/link";
import { CLASS_NAME } from "@/lib/constants";

export default function NavBar() {
  return (
    <header className="border-b-2 border-[#c99b3d] bg-[#12233f]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="font-serif text-lg font-bold text-[#f2ead6]"
        >
          Camille &amp; Scott&apos;s Baby Pool
          <span className="ml-2 hidden text-xs font-normal text-[#c99b3d] sm:inline">
            {CLASS_NAME}
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold text-[#f2ead6]/80">
          <Link href="/" className="hover:text-[#c99b3d]">
            Story
          </Link>
          <Link
            href="/pool"
            className="rounded-lg border border-[#c99b3d] px-3 py-1.5 text-[#f2ead6] hover:bg-[#c99b3d] hover:text-[#12233f]"
          >
            Enter the Pool
          </Link>
        </nav>
      </div>
    </header>
  );
}
