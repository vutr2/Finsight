"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { activities } from "@/lib/mock-data";
import { Search, BarChart3, BookOpen, Clock } from "lucide-react";

const typeConfig = {
  search: { icon: Search, color: "bg-accent/15 text-accent", label: "Tìm kiếm" },
  analysis: { icon: BarChart3, color: "bg-info/15 text-info", label: "Phân tích" },
  lesson: { icon: BookOpen, color: "bg-success/15 text-success", label: "Bài học" },
  glossary: { icon: BookOpen, color: "bg-warning/15 text-warning", label: "Thuật ngữ" },
};

export default function HistoryPage() {
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? activities : activities.filter((a) => a.type === tab);

  return (
    <div className="space-y-5 px-4 pt-6">
      <div>
        <h1 className="text-xl font-bold">Lịch sử</h1>
        <p className="text-sm text-muted">Hoạt động gần đây của bạn</p>
      </div>

      {/* Tabs */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {[
          { key: "all", label: "Tất cả" },
          { key: "search", label: "Tìm kiếm" },
          { key: "analysis", label: "Phân tích" },
          { key: "lesson", label: "Bài học" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              tab === t.key ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-2">
        {filtered.map((activity) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;
          return (
            <Card key={activity.id} className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                  <Clock size={10} />
                  <span>{activity.time}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
