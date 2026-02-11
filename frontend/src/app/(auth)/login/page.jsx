"use client";

import { Descope } from "@descope/nextjs-sdk";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-white">
          <span className="text-2xl font-bold">F</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Finsight</h1>
        <p className="mt-1 text-sm text-muted">
          Thông tin thị trường & Giáo dục đầu tư
        </p>
      </div>

      <div className="w-full max-w-sm">
        <Descope
          flowId="sign-up-or-in"
          onSuccess={() => router.push("/")}
          onError={(e) => console.error("Descope error:", e)}
          theme="light"
        />
      </div>

      <p className="mt-8 max-w-xs text-center text-xs text-muted leading-relaxed">
        Bằng việc đăng nhập, bạn đồng ý rằng Finsight chỉ cung cấp thông tin
        giáo dục, không phải lời khuyên tài chính.
      </p>
    </div>
  );
}
