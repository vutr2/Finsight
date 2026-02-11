import BottomNav from "@/components/layout/BottomNav";
import Disclaimer from "@/components/layout/Disclaimer";

export default function MainLayout({ children }) {
  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background">
      <main className="pb-24">{children}</main>
      <Disclaimer />
      <BottomNav />
    </div>
  );
}
