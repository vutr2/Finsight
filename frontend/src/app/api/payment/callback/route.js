import { NextResponse } from "next/server";
import { verifyCallback } from "@/lib/vnpay";

/**
 * VNPay redirects user here after payment.
 * We verify the hash, then redirect to /pricing with result.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const result = verifyCallback(searchParams);

  const baseUrl = new URL("/pricing", request.url);

  if (!result.isValid) {
    baseUrl.searchParams.set("payment", "invalid");
    return NextResponse.redirect(baseUrl);
  }

  if (result.responseCode === "00") {
    // Payment successful
    baseUrl.searchParams.set("payment", "success");
    baseUrl.searchParams.set("txnRef", result.txnRef);
  } else {
    // Payment failed or cancelled
    baseUrl.searchParams.set("payment", "failed");
    baseUrl.searchParams.set("code", result.responseCode);
  }

  return NextResponse.redirect(baseUrl);
}
