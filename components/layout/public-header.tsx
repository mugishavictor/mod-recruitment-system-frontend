import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold">MOD Recruitment</p>
            <p className="text-xs text-slate-500">Application System</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/apply"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100"
          >
            Apply
          </Link>
          <Link
            href="/profile-status"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100"
          >
            Track Status
          </Link>
          <Link
            href="/login"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}