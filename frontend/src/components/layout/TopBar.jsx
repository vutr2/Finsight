"use client";

import SearchBar from "@/components/ui/SearchBar";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-card-border bg-background/95 px-6 py-3 backdrop-blur-sm">
      <div className="w-full max-w-md">
        <SearchBar />
      </div>
    </header>
  );
}
