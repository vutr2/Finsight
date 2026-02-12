"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { activities } from "@/lib/mock-data";
import { Search, BarChart3, BookOpen, Clock } from "lucide-react";

const typeConfig = {
  search: { icon: Search, color: "bg-accent/15 text-accent", label: "Tim kiem" },
  analysis: { icon: BarChart3, color: "bg-info/15 text-info", label: "Phan tich" },
  lesson: { icon: BookOpen, color: "bg-success/15 text-success", label: "Bai hoc" },
  glossary: { icon: BookOpen, color: "bg-warning/15 text-warning", label: "Thuat ngu" },
};

export default function HistoryPage() {
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? activities : activities.filter((a) => a.type === tab);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lich su</h1>
          <p className="text-sm text-muted">Hoat dong gan day cua ban</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: "all", label: "Tat ca" },
            { key: "search", label: "Tim kiem" },
            { key: "analysis", label: "Phan tich" },
            { key: "lesson", label: "Bai hoc" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t.key ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="max-w-3xl space-y-2">
        {filtered.map((activity) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;
          return (
            <Card key={activity.id} className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.color}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.description}</p>
                <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
                  <Clock size={12} />
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
