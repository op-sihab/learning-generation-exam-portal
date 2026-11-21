"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Sparkles,
  ArrowLeft,
  PlayCircle
} from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { ExamCard } from "@/components/exam/ExamCard";
import { toBanglaNum } from "@/utils/format";

export default function ExamsCatalogPage() {
  const { exams, activeAttempt } = usePortal();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const subjects = useMemo(() => {
    const set = new Set<string>();
    exams.forEach((e) => {
      if (e.subject) set.add(e.subject);
    });
    return Array.from(set);
  }, [exams]);

  const activeAttemptExam = useMemo(() => {
    if (!activeAttempt) return null;
    return exams.find((e) => e.id === activeAttempt.examId);
  }, [exams, activeAttempt]);

  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      const matchSearch =
        searchTerm.trim() === "" ||
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.chapter?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSubject =
        selectedSubject === "all" || e.subject === selectedSubject;

      const matchType =
        selectedType === "all" ||
        (selectedType === "cbt" && e.type?.toLowerCase().includes("cbt")) ||
        (selectedType === "drill" && e.type?.toLowerCase().includes("drill")) ||
        (selectedType === "practice" && !e.type?.toLowerCase().includes("cbt"));

      return matchSearch && matchSubject && matchType;
    });
  }, [exams, searchTerm, selectedSubject, selectedType]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Active Attempt Notification */}
      {activeAttempt && activeAttemptExam && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 animate-pulse">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">
                আপনার একটি অসমাপ্ত পরীক্ষা চলমান রয়েছে
              </div>
              <div className="text-xs opacity-80">
                পরীক্ষা: {activeAttemptExam.name} • অবশিষ্ট সময়:{" "}
                {toBanglaNum(Math.floor(activeAttempt.examTimeRemaining / 60))} মিনিট
              </div>
            </div>
          </div>
          <Link
            href={`/exams/${activeAttempt.examId}/cbt`}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            পরীক্ষা চালিয়ে যান →
          </Link>
        </div>
      )}

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
              <FileText className="w-5 h-5" />
            </div>
            সকল পরীক্ষা ও মডেল টেস্ট
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            লাইভ CBT এক্সাম, কুইক ড্রিল ও প্র্যাকটিস মোডে তাৎক্ষণিক ব্যাখ্যামূলক পরীক্ষা
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 self-start md:self-center">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>মোট পরীক্ষা: {toBanglaNum(exams.length)} টি</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="পরীক্ষার নাম, বিষয় বা অধ্যায় দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSelectedType("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === "all"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              সব ধরন
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("cbt")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === "cbt"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              CBT লাইভ
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("drill")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === "drill"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              কুইক ড্রিল
            </button>
          </div>
        </div>

        {/* Subjects horizontal pill scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 dark:border-slate-800 pt-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
            বিষয় ফিল্টার:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSubject("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedSubject === "all"
                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            সকল বিষয় ({toBanglaNum(exams.length)})
          </button>
          {subjects.map((s) => {
            const count = exams.filter((e) => e.subject === s).length;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSubject(s)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedSubject === s
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {s} ({toBanglaNum(count)})
              </button>
            );
          })}
        </div>
      </div>

      {/* Exams Grid */}
      {filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
          <FileText className="w-10 h-10 mx-auto text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            কোনো পরীক্ষা পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            অনুগ্রহ করে কি-ওয়ার্ড পরিবর্তন করুন অথবা অন্য বিষয়ের ফিল্টার নির্বাচন করুন
          </p>
          {(searchTerm || selectedSubject !== "all" || selectedType !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedSubject("all");
                setSelectedType("all");
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
