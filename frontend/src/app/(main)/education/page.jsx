"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { glossaryTerms, lessons } from "@/lib/mock-data";
import { BookOpen, GraduationCap, Search, ChevronDown, ChevronUp } from "lucide-react";

function GlossaryItem({ term }) {
  const [open, setOpen] = useState(false);
  return (
    <Card
      className="cursor-pointer hover:border-accent/30 transition-colors"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-accent">{term.term}</p>
        {open ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
      </div>
      {open && (
        <div className="mt-2 space-y-1.5">
          <p className="text-xs text-muted leading-relaxed">{term.definition}</p>
          {term.example && (
            <p className="text-xs text-foreground/70 leading-relaxed rounded-lg bg-background p-2">
              💡 {term.example}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

function LessonCard({ lesson }) {
  const levelColors = {
    Beginner: "bg-success/15 text-success",
    Intermediate: "bg-warning/15 text-warning",
    Advanced: "bg-danger/15 text-danger",
  };

  return (
    <Card className="hover:border-accent/30 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-sm font-semibold leading-snug">{lesson.title}</p>
          <p className="mt-1 text-xs text-muted leading-relaxed">{lesson.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${levelColors[lesson.level]}`}>
              {lesson.level}
            </span>
            <span className="text-[10px] text-muted">{lesson.category}</span>
            <span className="text-[10px] text-muted">• {lesson.duration}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function EducationPage() {
  const [tab, setTab] = useState("glossary");
  const [search, setSearch] = useState("");

  const filteredTerms = glossaryTerms.filter(
    (t) =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLessons = lessons.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 px-4 pt-6">
      <div>
        <h1 className="text-xl font-bold">Học tập</h1>
        <p className="text-sm text-muted">Kiến thức đầu tư cho người mới bắt đầu</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm thuật ngữ hoặc bài học..."
          className="w-full rounded-xl border border-card-border bg-card-bg py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-card-bg p-1">
        <button
          onClick={() => setTab("glossary")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
            tab === "glossary" ? "bg-accent text-white" : "text-muted"
          }`}
        >
          <BookOpen size={14} />
          Thuật ngữ
        </button>
        <button
          onClick={() => setTab("lessons")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
            tab === "lessons" ? "bg-accent text-white" : "text-muted"
          }`}
        >
          <GraduationCap size={14} />
          Bài học
        </button>
      </div>

      {/* Content */}
      {tab === "glossary" ? (
        <div className="space-y-2">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((term) => <GlossaryItem key={term.term} term={term} />)
          ) : (
            <p className="py-8 text-center text-sm text-muted">Không tìm thấy thuật ngữ phù hợp</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
          ) : (
            <p className="py-8 text-center text-sm text-muted">Không tìm thấy bài học phù hợp</p>
          )}
        </div>
      )}
    </div>
  );
}
