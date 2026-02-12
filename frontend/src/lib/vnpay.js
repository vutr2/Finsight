import crypto from "crypto";

const TMN_CODE = process.env.VNPAY_TMN_CODE;
const HASH_SECRET = process.env.VNPAY_HASH_SECRET;
const VNPAY_URL = process.env.VNPAY_URL;
const RETURN_URL = process.env.VNPAY_RETURN_URL;

/**
 * Create VNPay payment URL
 * @param {string} orderId - Unique order ID (e.g. "PRO_userId_timestamp")
 * @param {number} amount - Amount in VND (e.g. 59000)
 * @param {string} orderInfo - Description
 * @param {string} ipAddr - Client IP
 * @returns {string} VNPay redirect URL
 */
export function createPaymentUrl(orderId, amount, orderInfo, ipAddr) {
  const now = new Date();
  const createDate = formatDate(now);
  const expireDate = formatDate(new Date(now.getTime() + 15 * 60 * 1000));

  const params = new URLSearchParams();
  params.append("vnp_Version", "2.1.0");
  params.append("vnp_Command", "pay");
  params.append("vnp_TmnCode", TMN_CODE);
  params.append("vnp_Locale", "vn");
  params.append("vnp_CurrCode", "VND");
  params.append("vnp_TxnRef", orderId);
  params.append("vnp_OrderInfo", orderInfo);
  params.append("vnp_OrderType", "other");
  params.append("vnp_Amount", String(amount * 100)); // VNPay expects amount * 100
  params.append("vnp_ReturnUrl", RETURN_URL);
  params.append("vnp_IpAddr", ipAddr);
  params.append("vnp_CreateDate", createDate);
  params.append("vnp_ExpireDate", expireDate);

  // Sort params alphabetically and sign
  const sorted = new URLSearchParams([...params.entries()].sort());
  const signData = sorted.toString();
  const hmac = crypto.createHmac("sha512", HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  sorted.append("vnp_SecureHash", signed);

  return `${VNPAY_URL}?${sorted.toString()}`;
}

/**
 * Verify VNPay callback/IPN hash
 * @param {URLSearchParams|Record<string,string>} query - callback query params
 * @returns {{ isValid: boolean, responseCode: string, txnRef: string }}
 */
export function verifyCallback(query) {
  const params = query instanceof URLSearchParams ? query : new URLSearchParams(query);

  const secureHash = params.get("vnp_SecureHash");
  params.delete("vnp_SecureHash");
  params.delete("vnp_SecureHashType");

  const sorted = new URLSearchParams([...params.entries()].sort());
  const signData = sorted.toString();
  const hmac = crypto.createHmac("sha512", HASH_SECRET);
  const checkHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return {
    isValid: secureHash === checkHash,
    responseCode: params.get("vnp_ResponseCode") || "",
    txnRef: params.get("vnp_TxnRef") || "",
    amount: Number(params.get("vnp_Amount") || 0) / 100,
  };
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}${m}${d}${h}${mi}${s}`;
}
