// Mock data for Finsight - will be replaced with real API data later

export const marketSummary = {
  vnIndex: { value: 1245.32, change: +12.45, changePercent: +1.01 },
  hnxIndex: { value: 228.15, change: -1.23, changePercent: -0.54 },
  upcom: { value: 92.67, change: +0.45, changePercent: +0.49 },
  volume: "682.5M",
  value: "18,234 tỷ",
};

export const topMovers = [
  { symbol: "VCB", name: "Vietcombank", price: 92500, change: +2.15, volume: "2.1M" },
  { symbol: "FPT", name: "FPT Corp", price: 128300, change: +3.42, volume: "5.8M" },
  { symbol: "VNM", name: "Vinamilk", price: 72400, change: -1.23, volume: "1.5M" },
  { symbol: "HPG", name: "Hòa Phát", price: 25650, change: +1.87, volume: "12.3M" },
  { symbol: "MWG", name: "Thế Giới Di Động", price: 54200, change: -0.55, volume: "3.2M" },
  { symbol: "VHM", name: "Vinhomes", price: 41300, change: +0.92, volume: "4.1M" },
  { symbol: "MSN", name: "Masan Group", price: 78900, change: +2.34, volume: "1.8M" },
  { symbol: "TCB", name: "Techcombank", price: 35400, change: -0.78, volume: "6.5M" },
];

export const stockDetail = {
  symbol: "VCB",
  name: "Ngân hàng TMCP Ngoại thương Việt Nam",
  price: 92500,
  change: +2.15,
  changePercent: +2.15,
  open: 90500,
  high: 93200,
  low: 90100,
  volume: "2,145,300",
  marketCap: "343.2 nghìn tỷ",
  pe: 14.8,
  pb: 3.2,
  eps: 6250,
  dividend: "1,500 VND (1.6%)",
  week52High: 98000,
  week52Low: 72000,
  rsi: 58.3,
  macd: { value: 1.23, signal: 0.89, histogram: 0.34 },
  bollingerBands: { upper: 95000, middle: 91000, lower: 87000 },
};

export const priceHistory = [
  { date: "22/12", open: 88000, high: 89500, low: 87200, close: 89000, volume: 1800000 },
  { date: "23/12", open: 89000, high: 90200, low: 88500, close: 88800, volume: 2100000 },
  { date: "24/12", open: 88800, high: 91500, low: 88000, close: 91200, volume: 2500000 },
  { date: "25/12", open: 91200, high: 92800, low: 90500, close: 90800, volume: 1900000 },
  { date: "26/12", open: 90800, high: 93200, low: 90100, close: 92500, volume: 2145300 },
  { date: "27/12", open: 92500, high: 93800, low: 91800, close: 93500, volume: 2300000 },
  { date: "28/12", open: 93500, high: 94200, low: 92000, close: 92800, volume: 2000000 },
  { date: "29/12", open: 92800, high: 93600, low: 91500, close: 93200, volume: 2200000 },
  { date: "30/12", open: 93200, high: 95000, low: 93000, close: 94500, volume: 2800000 },
  { date: "31/12", open: 94500, high: 95200, low: 93800, close: 92500, volume: 2145300 },
];

export const newsItems = [
  {
    id: 1,
    title: "VN-Index vượt mốc 1,245 điểm trong phiên giao dịch sáng",
    source: "VnExpress",
    time: "2 giờ trước",
    sentiment: "positive",
    summary: "Thị trường chứng khoán Việt Nam tăng điểm mạnh nhờ dòng tiền ngoại quay trở lại...",
  },
  {
    id: 2,
    title: "FPT công bố doanh thu quý 4 tăng 25% so với cùng kỳ",
    source: "CafeF",
    time: "3 giờ trước",
    sentiment: "positive",
    summary: "Tập đoàn FPT ghi nhận kết quả kinh doanh khả quan trong quý cuối năm...",
  },
  {
    id: 3,
    title: "Ngân hàng Nhà nước giữ nguyên lãi suất điều hành",
    source: "Thanh Niên",
    time: "5 giờ trước",
    sentiment: "neutral",
    summary: "NHNN quyết định duy trì mức lãi suất hiện tại để hỗ trợ tăng trưởng kinh tế...",
  },
  {
    id: 4,
    title: "Cổ phiếu thép chịu áp lực bán sau tin Trung Quốc tăng xuất khẩu",
    source: "VietStock",
    time: "6 giờ trước",
    sentiment: "negative",
    summary: "Nhóm cổ phiếu thép giảm mạnh do lo ngại cạnh tranh từ thép giá rẻ Trung Quốc...",
  },
];

export const glossaryTerms = [
  {
    term: "P/E (Price to Earnings)",
    definition: "Tỷ lệ giá cổ phiếu so với lợi nhuận trên mỗi cổ phiếu. P/E cao có thể nghĩa là thị trường kỳ vọng tăng trưởng cao, nhưng cũng có thể là cổ phiếu đang được định giá quá cao.",
    example: "VCB có P/E = 14.8, nghĩa là nhà đầu tư trả 14.8 đồng cho mỗi 1 đồng lợi nhuận.",
  },
  {
    term: "RSI (Relative Strength Index)",
    definition: "Chỉ số sức mạnh tương đối, đo lường tốc độ và mức thay đổi giá. RSI dao động từ 0-100. Thường RSI > 70 được coi là overbought, RSI < 30 là oversold.",
    example: "RSI = 58.3 nằm trong vùng trung tính, không quá mua cũng không quá bán.",
  },
  {
    term: "MACD (Moving Average Convergence Divergence)",
    definition: "Chỉ báo xu hướng cho thấy mối quan hệ giữa hai đường trung bình động của giá. Khi MACD cắt lên trên đường tín hiệu, đó có thể là tín hiệu tích cực.",
    example: "MACD = 1.23, Signal = 0.89 → MACD > Signal có thể cho thấy xu hướng tăng.",
  },
  {
    term: "Vốn hóa thị trường (Market Cap)",
    definition: "Tổng giá trị của tất cả cổ phiếu đang lưu hành. Tính bằng: Giá cổ phiếu × Số cổ phiếu lưu hành. Dùng để đánh giá quy mô công ty.",
    example: "VCB có vốn hóa 343.2 nghìn tỷ VND - thuộc nhóm vốn hóa lớn nhất sàn.",
  },
  {
    term: "Blue-chip",
    definition: "Cổ phiếu của các công ty lớn, có uy tín, hoạt động ổn định và thường trả cổ tức đều đặn. Tên gọi xuất phát từ chip có giá trị cao nhất trong poker.",
    example: "VCB, FPT, VNM là các cổ phiếu blue-chip tiêu biểu trên sàn HOSE.",
  },
  {
    term: "Bollinger Bands",
    definition: "Dải Bollinger gồm 3 đường: trung bình động (giữa), dải trên và dải dưới. Giá chạm dải trên có thể đang cao, chạm dải dưới có thể đang thấp so với trung bình.",
    example: "Dải trên: 95,000, Giữa: 91,000, Dải dưới: 87,000 → Giá 92,500 nằm gần dải giữa.",
  },
];

export const lessons = [
  {
    id: 1,
    title: "Chứng khoán là gì? Hướng dẫn cho người mới bắt đầu",
    category: "Cơ bản",
    duration: "5 phút đọc",
    level: "Beginner",
    description: "Tìm hiểu khái niệm cơ bản về chứng khoán, cách thị trường hoạt động, và tại sao mọi người đầu tư.",
  },
  {
    id: 2,
    title: "Cách đọc báo cáo tài chính đơn giản",
    category: "Phân tích cơ bản",
    duration: "8 phút đọc",
    level: "Beginner",
    description: "Hướng dẫn đọc 3 báo cáo quan trọng: Bảng cân đối kế toán, Kết quả kinh doanh, và Lưu chuyển tiền tệ.",
  },
  {
    id: 3,
    title: "RSI, MACD và cách áp dụng trong phân tích kỹ thuật",
    category: "Phân tích kỹ thuật",
    duration: "10 phút đọc",
    level: "Intermediate",
    description: "Hiểu cách sử dụng các chỉ báo kỹ thuật phổ biến để nhận biết xu hướng thị trường.",
  },
  {
    id: 4,
    title: "Quản lý rủi ro - Nguyên tắc vàng cho nhà đầu tư",
    category: "Chiến lược",
    duration: "7 phút đọc",
    level: "Intermediate",
    description: "Tại sao quản lý rủi ro quan trọng hơn tìm cổ phiếu tốt, và các nguyên tắc cơ bản.",
  },
  {
    id: 5,
    title: "Phân tích SWOT cho cổ phiếu - Hướng dẫn thực hành",
    category: "Phân tích cơ bản",
    duration: "12 phút đọc",
    level: "Intermediate",
    description: "Cách áp dụng mô hình SWOT để đánh giá điểm mạnh, yếu, cơ hội và thách thức của doanh nghiệp.",
  },
];

export const activities = [
  { id: 1, type: "search", description: "Tìm kiếm VCB", time: "Hôm nay, 10:30" },
  { id: 2, type: "analysis", description: "Xem phân tích FPT", time: "Hôm nay, 09:15" },
  { id: 3, type: "lesson", description: "Đọc bài: Cách đọc báo cáo tài chính", time: "Hôm qua, 20:00" },
  { id: 4, type: "search", description: "Tìm kiếm HPG", time: "Hôm qua, 15:45" },
  { id: 5, type: "glossary", description: "Tra cứu: RSI là gì?", time: "2 ngày trước" },
  { id: 6, type: "analysis", description: "Xem phân tích VNM", time: "2 ngày trước" },
  { id: 7, type: "lesson", description: "Đọc bài: Quản lý rủi ro", time: "3 ngày trước" },
];
