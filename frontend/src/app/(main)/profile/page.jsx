"use client";

import { useDescope, useUser, useSession } from "@descope/nextjs-sdk/client";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { User, Bell, Moon, HelpCircle, Shield, ExternalLink, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const { isAuthenticated } = useSession();
  const sdk = useDescope();
  const router = useRouter();

  async function handleLogout() {
    await sdk.logout();
    router.push("/login");
  }

  return (
    <div className="space-y-5 px-4 pt-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white">
          <User size={28} />
        </div>
        <div>
          <h1 className="text-xl font-bold">
            {isAuthenticated ? user?.name || "Người dùng" : "Khách"}
          </h1>
          <p className="text-sm text-muted">
            {isAuthenticated ? user?.email || "" : "Đăng nhập để lưu lịch sử"}
          </p>
        </div>
      </div>

      {/* Auth Button */}
      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-danger/30 py-3 text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      ) : (
        <button
          onClick={() => router.push("/login")}
          className="w-full rounded-xl bg-accent py-3 text-center text-sm font-bold text-white hover:bg-accent-dim transition-colors"
        >
          Đăng nhập / Đăng ký
        </button>
      )}

      {/* Settings */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wider">
          Cài đặt
        </h2>
        <div className="space-y-1">
          {[
            { icon: Bell, label: "Thông báo", desc: "Nhận newsletter hàng ngày" },
            { icon: Moon, label: "Giao diện", desc: "Sáng (mặc định)" },
          ].map((item) => (
            <Card key={item.label} className="flex items-center gap-3 hover:border-accent/30 transition-colors cursor-pointer">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <item.icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Info */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wider">
          Thông tin
        </h2>
        <div className="space-y-1">
          {[
            { icon: HelpCircle, label: "Trợ giúp & FAQ" },
            { icon: Shield, label: "Chính sách bảo mật" },
            { icon: ExternalLink, label: "Về Finsight" },
          ].map((item) => (
            <Card key={item.label} className="flex items-center gap-3 hover:border-accent/30 transition-colors cursor-pointer">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card-border/50 text-muted">
                <item.icon size={16} />
              </div>
              <p className="text-sm font-medium">{item.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <Card className="border-warning/20 bg-warning/5">
        <p className="text-xs text-warning/80 leading-relaxed">
          ⚠️ Finsight chỉ cung cấp thông tin mang tính giáo dục và tham khảo.
          Đây không phải lời khuyên tài chính hay đầu tư. Hãy tham khảo chuyên gia
          và sử dụng các sàn giao dịch uy tín (SSI, VNDIRECT, v.v.) trước khi
          quyết định đầu tư.
        </p>
      </Card>

      <p className="pb-4 text-center text-xs text-muted">Finsight v0.1.0</p>
    </div>
  );
}
