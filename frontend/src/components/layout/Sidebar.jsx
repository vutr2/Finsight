"use client";

import { Home, BarChart3, BookOpen, Clock, User, GraduationCap, CreditCard, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", icon: Home, label: "Trang chủ" },
  { href: "/analysis", icon: BarChart3, label: "Phân tích" },
  { href: "/education", icon: GraduationCap, label: "Học tập" },
  { href: "/history", icon: Clock, label: "Lịch sử" },
  { href: "/pricing", icon: CreditCard, label: "Nâng cấp Pro" },
  { href: "/profile", icon: User, label: "Cá nhân" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close sidebar when clicking a nav link
  function handleNavClick() {
    setOpen(false);
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-card-border bg-card-bg text-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-60 flex-col border-r border-card-border bg-card-bg transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:z-40`}
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
              <span className="text-sm font-bold">F</span>
            </div>
            <span className="text-lg font-bold text-foreground">Finsight</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-muted lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 pt-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:bg-card-border/50 hover:text-foreground"
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Disclaimer */}
        <div className="border-t border-card-border px-4 py-4">
          <p className="text-[11px] leading-relaxed text-muted">
            Finsight chỉ cung cấp thông tin giáo dục. Không phải lời khuyên tài chính.
          </p>
        </div>
      </aside>
    </>
  );
}
