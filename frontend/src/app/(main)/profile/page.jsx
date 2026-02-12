"use client";

import { useDescope, useUser, useSession } from "@descope/nextjs-sdk/client";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/lib/useSubscription";
import Card from "@/components/ui/Card";
import { User, Bell, Moon, HelpCircle, Shield, ExternalLink, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useUser();
  const { isAuthenticated } = useSession();
  const sdk = useDescope();
  const router = useRouter();
  const { isPro } = useSubscription();

  async function handleLogout() {
    await sdk.logout();
    router.push("/login");
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile Header */}
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white">
          <User size={28} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {isAuthenticated ? user?.name || "Nguoi dung" : "Khach"}
          </h1>
          <p className="text-sm text-muted">
            {isAuthenticated ? user?.email || "" : "Dang nhap de luu lich su"}
          </p>
        </div>

        {/* Auth Button */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-danger/30 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut size={16} />
            Dang xuat
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-bold text-white hover:bg-accent-dim transition-colors"
          >
            Dang nhap / Dang ky
          </button>
        )}
      </div>

      {/* Subscription Status */}
      {isAuthenticated && (
        <Card className={isPro ? "border-accent/30 bg-accent/5" : ""}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isPro ? "bg-accent/15 text-accent" : "bg-card-border/50 text-muted"}`}>
                <Sparkles size={18} />
              </div>
              <div>
                <p className="font-medium">
                  {isPro ? "Finsight Pro" : "Goi mien phi"}
                </p>
                <p className="text-sm text-muted">
                  {isPro ? "Dang su dung — bao gom phan tich AI" : "Nang cap de mo khoa phan tich AI"}
                </p>
              </div>
            </div>
            {!isPro && (
              <Link
                href="/pricing"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
              >
                Nang cap Pro
              </Link>
            )}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Settings */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wider">
            Cai dat
          </h2>
          <div className="space-y-2">
            {[
              { icon: Bell, label: "Thong bao", desc: "Nhan newsletter hang ngay" },
              { icon: Moon, label: "Giao dien", desc: "Sang (mac dinh)" },
            ].map((item) => (
              <Card key={item.label} className="flex items-center gap-3 hover:border-accent/30 transition-colors cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <item.icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Info */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wider">
            Thong tin
          </h2>
          <div className="space-y-2">
            {[
              { icon: HelpCircle, label: "Tro giup & FAQ" },
              { icon: Shield, label: "Chinh sach bao mat" },
              { icon: ExternalLink, label: "Ve Finsight" },
            ].map((item) => (
              <Card key={item.label} className="flex items-center gap-3 hover:border-accent/30 transition-colors cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card-border/50 text-muted">
                  <item.icon size={18} />
                </div>
                <p className="font-medium">{item.label}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Disclaimer */}
      <Card className="border-warning/20 bg-warning/5">
        <p className="text-sm text-warning/80 leading-relaxed">
          Finsight chi cung cap thong tin mang tinh giao duc va tham khao. Day khong phai loi khuyen tai chinh hay dau tu. Hay tham khao chuyen gia va su dung cac san giao dich uy tin (SSI, VNDIRECT, v.v.) truoc khi quyet dinh dau tu.
        </p>
      </Card>

      <p className="text-center text-sm text-muted">Finsight v0.1.0</p>
    </div>
  );
}
