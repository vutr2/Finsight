import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar />
      <main className="flex-1 overflow-y-auto px-4 pb-20 pt-4 sm:px-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
