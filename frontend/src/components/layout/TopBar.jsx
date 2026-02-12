"use client";

import SearchBar from "@/components/ui/SearchBar";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-card-border bg-background/95 px-4 py-2.5 sm:px-6 backdrop-blur-md">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
        <span className="text-xs font-bold text-white">F</span>
      </div>
      <div className="flex-1">
        <SearchBar />
      </div>
    </header>
  );
}
