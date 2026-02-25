import crypto from 'crypto';

export const vnpayConfig = {
  vnp_TmnCode: process.env.VNPAY_TMN_CODE,
  vnp_HashSecret: process.env.VNPAY_HASH_SECRET,
  vnp_Url:
    process.env.VNPAY_URL ||
    'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_ReturnUrl:
    process.env.VNPAY_RETURN_URL ||
    'http://localhost:3000/api/vnpay/callback',
  vnp_IpnUrl:
    process.env.VNPAY_IPN_URL || 'http://localhost:3000/api/vnpay/ipn',
};

// Sort object by keys and encode values (spaces → +)
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort(); // fixed: was OBject
  keys.forEach((key) => {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
  });
  return sorted;
}

export function createPaymentUrl({
  amount,
  orderId,
  orderInfo,
  ipAddr,
  locale = 'vn',
  bankCode = '',
}) {
  // Normalize IPv6 loopback to IPv4
  const ip = (ipAddr === '::1' || ipAddr === '::ffff:127.0.0.1') ? '127.0.0.1' : ipAddr;

  const date = new Date();
  const createDate =
    date.getFullYear().toString() +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    ('0' + date.getDate()).slice(-2) +
    ('0' + date.getHours()).slice(-2) +  // fixed: was getHour()
    ('0' + date.getMinutes()).slice(-2) +
    ('0' + date.getSeconds()).slice(-2);

  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = vnpayConfig.vnp_TmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = 'VND';
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = Math.round(amount * 100);
  vnp_Params['vnp_ReturnUrl'] = vnpayConfig.vnp_ReturnUrl;
  vnp_Params['vnp_IpAddr'] = ip;
  vnp_Params['vnp_CreateDate'] = createDate;

  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = Object.keys(vnp_Params)
    .map((key) => `${key}=${vnp_Params[key]}`)  // fixed: was `${key} =${...}` (extra space)
    .join('&');

  const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  vnp_Params['vnp_SecureHash'] = signed;

  const paymentUrl =
    vnpayConfig.vnp_Url +
    '?' +
    Object.keys(vnp_Params)
      .map((key) => `${key}=${vnp_Params[key]}`)
      .join('&');

  return paymentUrl;
}

export function verifyReturnUrl(params) {
  const secureHash = params['vnp_SecureHash'];
  const vnp_Params = { ...params };
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const sortedParams = sortObject(vnp_Params);

  const signData = Object.keys(sortedParams)
    .map((key) => `${key}=${sortedParams[key]}`)
    .join('&');

  const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  return secureHash === signed;
}

export function getResponseDescription(responseCode) {
  const descriptions = {
    '00': 'Giao dịch thành công',
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ.',
    '09': 'Thẻ/Tài khoản chưa đăng ký InternetBanking.',
    '10': 'Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.',
    '11': 'Đã hết hạn chờ thanh toán.',
    '12': 'Thẻ/Tài khoản bị khóa.',
    '13': 'Sai mật khẩu xác thực giao dịch (OTP).',
    '24': 'Khách hàng hủy giao dịch.',
    '51': 'Tài khoản không đủ số dư.',
    '65': 'Tài khoản vượt quá hạn mức giao dịch trong ngày.',
    '75': 'Ngân hàng thanh toán đang bảo trì.',
    '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định.',
    '99': 'Lỗi không xác định.',
  };
  return descriptions[responseCode] || 'Lỗi không xác định';
}
