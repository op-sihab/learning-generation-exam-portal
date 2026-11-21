"use client";

import React, { useState, useMemo } from "react";
import { BookOpen, Search, Layers } from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { CourseCard } from "@/components/course/CourseCard";
import { toBanglaNum } from "@/utils/format";

export default function CoursesPage() {
  const { courses, activeUser } = usePortal();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<string>("all");

  const batches = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.sub) set.add(c.sub);
    });
    return Array.from(set);
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return courses.filter((c) => {
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.desc?.toLowerCase().includes(q) ||
        c.subjects?.some(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.chapters.some((ch) => ch.toLowerCase().includes(q))
        );

      const matchBatch = selectedBatch === "all" || c.sub === selectedBatch;
      return matchSearch && matchBatch;
    });
  }, [courses, searchTerm, selectedBatch]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span className="w-10 h-10 rounded-xl bg-blue-500/12 border border-blue-500/25 flex items-center justify-center shrink-0 mt-0.5">
            <Layers className="w-5 h-5 text-blue-400" />
          </span>
          <div>
            <p className="text-xs font-semibold text-blue-400">
              একাডেমিক প্রোগ্রাম
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 leading-tight">
              সকল কোর্স ও সিলেবাস
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              SSC, HSC এবং বিশ্ববিদ্যালয় ভর্তি পরীক্ষার বিষয়ভিত্তিক প্রস্তুতি প্রোগ্রাম · মোট{" "}
              <span className="font-mono tabular-nums font-semibold text-slate-200">
                {toBanglaNum(courses.length)}টি
              </span>{" "}
              কোর্স
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="কোর্সের নাম, বিষয় বা অধ্যায় খুঁজুন..."
            aria-label="কোর্স খুঁজুন"
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-white/[0.1] bg-[#131824] text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#131824] border border-white/[0.06] overflow-x-auto no-scrollbar text-xs font-medium">
          <button
            type="button"
            onClick={() => setSelectedBatch("all")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
              selectedBatch === "all"
                ? "bg-[#1C2436] text-white font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            সব ব্যাচ
          </button>
          {batches.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBatch(b)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                selectedBatch === b
                  ? "bg-[#1C2436] text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course, idx) => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={course.name === activeUser.targetBatch}
              priority={idx === 0}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-white/[0.12] bg-[#0C0F16]">
          <BookOpen className="w-9 h-9 mx-auto text-slate-500 mb-3" />
          <h3 className="text-base font-bold text-slate-100">
            কোনো কোর্স পাওয়া যায়নি
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            অন্য কোনো কি-ওয়ার্ড দিয়ে খুঁজুন অথবা ফিল্টার পরিবর্তন করুন
          </p>
          {(searchTerm || selectedBatch !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedBatch("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#131824] border border-white/[0.1] text-xs font-semibold text-slate-200 hover:bg-[#181F2E] transition-colors"
            >
              সব ফিল্টার রিসেট করুন
            </button>
          )}
        </div>
      )}
    </div>
  );
}
