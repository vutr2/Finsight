/**
 * n8n Webhook Client
 *
 * Gọi tới các n8n workflow webhooks.
 * Mỗi workflow trong n8n cần có một Webhook node làm trigger
 * với path tương ứng (VD: /market-summary, /stock-analysis, ...).
 *
 * Cách setup trong n8n:
 * 1. Tạo workflow mới
 * 2. Thêm Webhook node → chọn method GET hoặc POST
 * 3. Copy webhook URL path và set vào biến env tương ứng
 * 4. Nối tiếp các node xử lý (HTTP Request, Code, AI Agent, ...)
 * 5. Activate workflow
 */

const N8N_BASE_URL = process.env.N8N_WEBHOOK_BASE_URL || "";

/**
 * Gọi n8n webhook
 * @param {string} path - Webhook path (VD: "/market-summary")
 * @param {object} options - Fetch options
 * @param {object} options.params - Query parameters
 * @param {object} options.body - POST body
 * @param {string} options.method - HTTP method (default: GET)
 */
export async function callN8n(path, options = {}) {
  const { params, body, method = "GET" } = options;

  const url = new URL(`${N8N_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    });
  }

  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), fetchOptions);

  if (!res.ok) {
    throw new Error(`n8n webhook error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Webhook paths - Cập nhật theo workflow n8n của bạn
 * Mỗi path tương ứng với một Webhook node trong n8n
 */
export const WEBHOOKS = {
  MARKET_SUMMARY: "/market-summary",
  STOCK_ANALYSIS: "/stock-analysis",
  NEWS: "/news",
  EDUCATION: "/education",
  SENTIMENT: "/sentiment",
};
