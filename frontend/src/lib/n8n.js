/**
 * n8n Webhook Client - 1 Workflow duy nhất
 *
 * Chỉ cần 1 workflow trong n8n với 1 Webhook node.
 * Phân biệt request bằng query param "action":
 *   ?action=market-summary
 *   ?action=stock-analysis&symbol=VCB
 *   ?action=news&limit=10
 *   ?action=education&type=glossary
 *
 * Cách setup trong n8n:
 * 1. Tạo 1 workflow duy nhất
 * 2. Thêm Webhook node (GET) với path: /finsight
 * 3. Thêm Switch node → đọc query.action để phân nhánh:
 *    - "market-summary" → nhánh fetch VN-Index, HNX, top movers
 *    - "stock-analysis" → nhánh fetch data cổ phiếu + tính RSI/MACD
 *    - "news"           → nhánh fetch tin tức + sentiment
 *    - "education"      → nhánh trả glossary/lessons
 * 4. Mỗi nhánh kết thúc bằng Respond to Webhook node trả JSON
 * 5. Activate workflow
 */

const N8N_BASE_URL = process.env.N8N_WEBHOOK_BASE_URL || "";
const WEBHOOK_PATH = "/finsight";

/**
 * Gọi n8n webhook với action cụ thể
 * @param {string} action - Tên action (VD: "market-summary", "stock-analysis")
 * @param {object} params - Query params bổ sung (VD: { symbol: "VCB" })
 */
export async function callN8n(action, params = {}) {
  const url = new URL(`${N8N_BASE_URL}${WEBHOOK_PATH}`);
  url.searchParams.set("action", action);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`n8n webhook error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/** Các action tương ứng với nhánh Switch trong n8n */
export const ACTIONS = {
  MARKET_SUMMARY: "market-summary",
  STOCK_ANALYSIS: "stock-analysis",
  NEWS: "news",
  EDUCATION: "education",
};
