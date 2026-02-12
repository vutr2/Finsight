"use client";

import { Home, BarChart3, GraduationCap, CreditCard, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", icon: Home, label: "Trang chủ" },
  { href: "/analysis", icon: BarChart3, label: "Phân tích" },
  { href: "/education", icon: GraduationCap, label: "Học tập" },
  { href: "/pricing", icon: CreditCard, label: "Pro" },
  { href: "/profile", icon: User, label: "Cá nhân" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-card-border bg-card-bg/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-1 pt-1.5 pb-1">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium transition-colors ${
                isActive ? "text-accent" : "text-muted"
              }`}
            >
              <tab.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
