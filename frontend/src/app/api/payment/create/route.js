import { NextResponse } from "next/server";
import { createPaymentUrl } from "@/lib/vnpay";

export async function POST(request) {
  try {
    const { userId, userEmail } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Vui long dang nhap truoc khi thanh toan" },
        { status: 401 }
      );
    }

    const orderId = `PRO_${userId.slice(0, 8)}_${Date.now()}`;
    const amount = 59000; // 59k VND/month
    const orderInfo = `Finsight Pro - ${userEmail || userId}`;

    // Get client IP from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddr = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const paymentUrl = createPaymentUrl(orderId, amount, orderInfo, ipAddr);

    return NextResponse.json({ paymentUrl, orderId });
  } catch (error) {
    console.error("Payment create error:", error);
    return NextResponse.json(
      { error: "Khong the tao link thanh toan" },
      { status: 500 }
    );
  }
}
