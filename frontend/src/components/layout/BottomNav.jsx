"use client";

import { Home, BarChart3, ArrowLeftRight, Clock, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: Home, label: "Trang chủ" },
  { href: "/analysis", icon: BarChart3, label: "Phân tích" },
  { href: "/education", icon: ArrowLeftRight, label: "Học tập" },
  { href: "/history", icon: Clock, label: "Lịch sử" },
  { href: "/profile", icon: User, label: "Cá nhân" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-card-border bg-card-bg/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
