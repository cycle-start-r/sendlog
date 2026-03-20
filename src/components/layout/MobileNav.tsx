"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Mountain, LayoutDashboard, ClipboardList, TrendingUp, Target, BookOpen, Flag, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sessions", label: "Sessions", icon: ClipboardList },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/projects", label: "Projects", icon: Target },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/goals", label: "Goals", icon: Flag },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="relative z-10 flex flex-col w-64 bg-slate-900 text-white h-full">
            <div className="flex items-center justify-between px-5 py-5 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Mountain className="w-6 h-6 text-brand-400" />
                <span className="font-bold text-lg">Sendlog</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
              {nav.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === href || pathname.startsWith(href + "/")
                      ? "bg-brand-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
