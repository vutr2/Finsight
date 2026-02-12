"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useEducation } from "@/lib/hooks";
import { glossaryTerms as fallbackGlossary, lessons as fallbackLessons } from "@/lib/mock-data";
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
        <div className="mt-2 space-y-2">
          <p className="text-sm text-muted leading-relaxed">{term.definition}</p>
          {term.example && (
            <p className="text-sm text-foreground/70 leading-relaxed rounded-lg bg-card-border/30 p-3">
              {term.example}
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
      <p className="font-semibold leading-snug">{lesson.title}</p>
      <p className="mt-1 text-sm text-muted leading-relaxed">{lesson.description}</p>
      <div className="mt-3 flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColors[lesson.level]}`}>
          {lesson.level}
        </span>
        <span className="text-xs text-muted">{lesson.category}</span>
        <span className="text-xs text-muted">{lesson.duration}</span>
      </div>
    </Card>
  );
}

export default function EducationPage() {
  const [tab, setTab] = useState("glossary");
  const [search, setSearch] = useState("");
  const { data: eduData } = useEducation();

  const glossaryTerms = eduData?.glossary || fallbackGlossary;
  const lessons = eduData?.lessons || fallbackLessons;

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Hoc tap</h1>
          <p className="text-sm text-muted">Kien thuc dau tu cho nguoi moi bat dau</p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-card-bg p-1">
          <button
            onClick={() => setTab("glossary")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === "glossary" ? "bg-accent text-white" : "text-muted"
            }`}
          >
            <BookOpen size={14} />
            Thuat ngu
          </button>
          <button
            onClick={() => setTab("lessons")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === "lessons" ? "bg-accent text-white" : "text-muted"
            }`}
          >
            <GraduationCap size={14} />
            Bai hoc
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tim thuat ngu hoac bai hoc..."
          className="w-full rounded-xl border border-card-border bg-card-bg py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {/* Content */}
      {tab === "glossary" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((term) => <GlossaryItem key={term.term} term={term} />)
          ) : (
            <p className="col-span-2 py-12 text-center text-sm text-muted">Khong tim thay thuat ngu phu hop</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
          ) : (
            <p className="col-span-2 py-12 text-center text-sm text-muted">Khong tim thay bai hoc phu hop</p>
          )}
        </div>
      )}
    </div>
  );
}
