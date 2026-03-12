"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Briefcase,
} from "lucide-react";

type DashboardShellProps = {
  title: string;
  children: React.ReactNode;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Applicants",
    href: "/applications",
    icon: FileText,
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
  },
];

export default function DashboardShell({
  title,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const fullName =
    typeof window !== "undefined" ? localStorage.getItem("fullName") : null;

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r bg-white lg:flex">
          <div className="border-b px-6 py-5">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">
                  MOD Recruitment
                </p>
                <p className="text-xs text-slate-500">Admin Panel</p>
              </div>
            </Link>
          </div>

          <div className="flex-1 px-4 py-6">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>

            <nav className="mt-4 space-y-2">
              {navItems.map((item) => {
                if (item.href === "/users" && role !== "SUPER_ADMIN") {
                  return null;
                }

                const Icon = item.icon;
                const active = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t p-4">
            <div className="mb-4 rounded-2xl bg-slate-100 p-4">
              <p className="text-sm font-medium text-slate-900">
                {fullName || "Authenticated User"}
              </p>
              <p className="text-xs text-slate-500">{role || "User"}</p>
            </div>

            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b bg-white px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {title}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Manage recruitment activities from one place.
                </p>
              </div>
            </div>
          </header>

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}