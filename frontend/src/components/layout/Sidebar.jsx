"use client";

import { Home, BarChart3, BookOpen, Clock, User, GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: Home, label: "Trang chủ" },
  { href: "/analysis", icon: BarChart3, label: "Phân tích" },
  { href: "/education", icon: GraduationCap, label: "Học tập" },
  { href: "/history", icon: Clock, label: "Lịch sử" },
  { href: "/profile", icon: User, label: "Cá nhân" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-card-border bg-card-bg">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
          <span className="text-sm font-bold">F</span>
        </div>
        <span className="text-lg font-bold text-foreground">Finsight</span>
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
  );
}
