"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Search, Filter, Sparkles, ArrowLeft } from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { CourseCard } from "@/components/course/CourseCard";
import { toBanglaNum } from "@/utils/format";

export default function CoursesPage() {
  const { courses } = usePortal();
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
    return courses.filter((c) => {
      const matchSearch =
        searchTerm.trim() === "" ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subjects?.some(
          (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.chapters.some((ch) => ch.toLowerCase().includes(searchTerm.toLowerCase()))
        );

      const matchBatch =
        selectedBatch === "all" || c.sub === selectedBatch;

      return matchSearch && matchBatch;
    });
  }, [courses, searchTerm, selectedBatch]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              ড্যাশবোর্ডে ফিরুন
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            সকল কোর্স ও সিলেবাস
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            এসএসসি, এইচএসসি এবং বিশ্ববিদ্যালয় ভর্তি পরীক্ষার জন্য বিষয়ভিত্তিক প্রস্তুতি কোর্স
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 self-start md:self-center">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>মোট কোর্স: {toBanglaNum(courses.length)} টি</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="কোর্সের নাম বা বিষয় দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <button
            type="button"
            onClick={() => setSelectedBatch("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedBatch === "all"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            সব ব্যাচ
          </button>
          {batches.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBatch(b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedBatch === b
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
          <BookOpen className="w-10 h-10 mx-auto text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            কোনো কোর্স পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড দিয়ে খুঁজুন অথবা ফিল্টার পরিবর্তন করুন
          </p>
          {(searchTerm || selectedBatch !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedBatch("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              সব ফিল্টার রিসেট করুন
            </button>
          )}
        </div>
      )}
    </div>
  );
}
