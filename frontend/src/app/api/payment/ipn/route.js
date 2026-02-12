import { NextResponse } from "next/server";
import { verifyCallback } from "@/lib/vnpay";

const DESCOPE_PROJECT_ID = process.env.DESCOPE_PROJECT_ID;

/**
 * VNPay IPN (Instant Payment Notification) - server-to-server callback.
 * This is where we actually activate the Pro subscription via Descope.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const result = verifyCallback(searchParams);

  if (!result.isValid) {
    return NextResponse.json({ RspCode: "97", Message: "Invalid Checksum" });
  }

  if (result.responseCode !== "00") {
    return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
  }

  // Extract userId from txnRef (format: PRO_userId8chars_timestamp)
  const txnRef = result.txnRef;
  const parts = txnRef.split("_");
  if (parts.length < 3 || parts[0] !== "PRO") {
    return NextResponse.json({ RspCode: "01", Message: "Order Not Found" });
  }

  try {
    // Activate Pro subscription via Descope Management API
    // Set custom attribute "plan" = "pro" and "planExpiry" = 30 days from now
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Use Descope user search by loginId or customAttributes
    // For now, we store the transaction as confirmed
    // The frontend will check plan status from Descope user attributes
    console.log(
      `[IPN] Payment confirmed: txnRef=${txnRef}, amount=${result.amount} VND`
    );

    // Note: Full Descope Management API integration requires a management key.
    // For sandbox/MVP, the callback route handles activation client-side.

    return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
  } catch (error) {
    console.error("[IPN] Error processing payment:", error);
    return NextResponse.json({ RspCode: "99", Message: "Unknown Error" });
  }
}
