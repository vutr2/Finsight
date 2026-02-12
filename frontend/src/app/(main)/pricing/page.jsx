"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { useUser, useSession } from "@descope/nextjs-sdk/client";
import { useSubscription } from "@/lib/useSubscription";
import Card from "@/components/ui/Card";
import {
  Check,
  X,
  Sparkles,
  BarChart3,
  BookOpen,
  Loader2,
  CreditCard,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const FREE_FEATURES = [
  { text: "Du lieu thi truong realtime", included: true },
  { text: "Bieu do gia co phieu", included: true },
  { text: "Chi bao ky thuat (RSI, MACD, Bollinger)", included: true },
  { text: "Tin tuc thi truong", included: true },
  { text: "Tai lieu hoc tap", included: true },
  { text: "Phan tich AI chi tiet", included: false },
];

const PRO_FEATURES = [
  { text: "Tat ca tinh nang mien phi", included: true },
  { text: "Phan tich AI chi tiet cho moi co phieu", included: true },
  { text: "AI giai thich chi bao cho nguoi moi", included: true },
  { text: "Ho tro uu tien", included: true },
];

function PricingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const { isAuthenticated } = useSession();
  const { isPro, activatePro } = useSubscription();
  const [payLoading, setPayLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Handle VNPay callback redirect
  const paymentStatus = searchParams.get("payment");

  useEffect(() => {
    if (paymentStatus === "success") {
      activatePro();
      setMessage({ type: "success", text: "Thanh toan thanh cong! Ban da la thanh vien Pro." });
    } else if (paymentStatus === "failed") {
      setMessage({ type: "error", text: "Thanh toan that bai. Vui long thu lai." });
    } else if (paymentStatus === "invalid") {
      setMessage({ type: "error", text: "Giao dich khong hop le." });
    }
  }, [paymentStatus, activatePro]);

  async function handleUpgrade() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setPayLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          userEmail: user.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Redirect to VNPay payment page
      window.location.href = data.paymentUrl;
    } catch (err) {
      setMessage({ type: "error", text: err.message });
      setPayLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nang cap Finsight Pro</h1>
        <p className="text-sm text-muted">
          Mo khoa phan tich AI de hieu sau hon ve co phieu va thi truong.
        </p>
      </div>

      {/* Payment result message */}
      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
            message.type === "success"
              ? "border-success/30 bg-success/10 text-success"
              : "border-danger/30 bg-danger/10 text-danger"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <XCircle size={16} />
          )}
          {message.text}
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card className="relative">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Mien phi</h2>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold">0</span>
              <span className="text-sm text-muted">VND/thang</span>
            </div>
          </div>

          <div className="space-y-3">
            {FREE_FEATURES.map((f) => (
              <div key={f.text} className="flex items-center gap-2 text-sm">
                {f.included ? (
                  <Check size={14} className="text-success shrink-0" />
                ) : (
                  <X size={14} className="text-muted shrink-0" />
                )}
                <span className={f.included ? "" : "text-muted"}>
                  {f.text}
                </span>
              </div>
            ))}
          </div>

          <button
            disabled
            className="mt-6 w-full rounded-lg border border-card-border py-2.5 text-sm font-medium text-muted cursor-default"
          >
            Goi hien tai
          </button>
        </Card>

        {/* Pro Plan */}
        <Card className="relative border-accent/50 bg-accent/5">
          <div className="absolute -top-3 left-4 rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-white">
            Khuyen nghi
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              Pro
              <Sparkles size={16} className="text-accent" />
            </h2>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-accent">59,000</span>
              <span className="text-sm text-muted">VND/thang</span>
            </div>
          </div>

          <div className="space-y-3">
            {PRO_FEATURES.map((f) => (
              <div key={f.text} className="flex items-center gap-2 text-sm">
                <Check size={14} className="text-accent shrink-0" />
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          {isPro ? (
            <button
              disabled
              className="mt-6 w-full rounded-lg bg-success/15 py-2.5 text-sm font-bold text-success cursor-default"
            >
              <CheckCircle2 size={14} className="inline mr-1" />
              Dang su dung Pro
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={payLoading}
              className="mt-6 w-full rounded-lg bg-accent py-2.5 text-sm font-bold text-white hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {payLoading ? (
                <>
                  <Loader2 size={14} className="inline mr-1 animate-spin" />
                  Dang xu ly...
                </>
              ) : (
                <>
                  <CreditCard size={14} className="inline mr-1" />
                  Nang cap ngay
                </>
              )}
            </button>
          )}
        </Card>
      </div>

      {/* Why Pro */}
      <Card>
        <h3 className="font-semibold mb-3">Tai sao chon Finsight Pro?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Sparkles,
              title: "AI Phan tich",
              desc: "AI giai thich chi bao ky thuat, giup ban hieu tai sao co phieu tang/giam.",
            },
            {
              icon: BarChart3,
              title: "Hieu sau hon",
              desc: "Tu xem so lieu den hieu y nghia — buoc dem cho nha dau tu tu tin.",
            },
            {
              icon: BookOpen,
              title: "Hoc qua thuc hanh",
              desc: "Moi lan phan tich la mot bai hoc. Dan dan ban se tu doc duoc bieu do.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <item.icon size={18} />
              </div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-center text-xs text-muted">
        Thanh toan an toan qua VNPay. Huy bat cu luc nao.
      </p>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="text-muted text-sm">Dang tai...</div>}>
      <PricingContent />
    </Suspense>
  );
}
