"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ placeholder = "Tìm mã CK hoặc chủ đề..." }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/analysis?q=${encodeURIComponent(query.trim().toUpperCase())}`);
      setQuery("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-card-border bg-card-bg py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />
    </form>
  );
}
