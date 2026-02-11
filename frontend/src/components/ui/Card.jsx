export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border border-card-border bg-card-bg p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
