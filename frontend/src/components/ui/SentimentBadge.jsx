export default function SentimentBadge({ sentiment }) {
  const config = {
    positive: { label: "Tích cực", className: "bg-success/15 text-success" },
    negative: { label: "Tiêu cực", className: "bg-danger/15 text-danger" },
    neutral: { label: "Trung tính", className: "bg-warning/15 text-warning" },
  };
  const { label, className } = config[sentiment] || config.neutral;

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
