"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FileText, Search, Clock, ArrowRight } from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { ExamCard } from "@/components/exam/ExamCard";
import { toBanglaNum } from "@/utils/format";
import { filterExams } from "@/utils/portalHelpers";

export default function ExamsCatalogPage() {
  const {
    exams,
    courses,
    activeAttempt,
    history,
    bestScoreByExam,
    latestResultByExam
  } = usePortal();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"all" | "cbt" | "drill">(
    "all"
  );

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

  const completedExamIds = useMemo(
    () => new Set(history.map((h) => h.examId)),
    [history]
  );

  const filteredExams = useMemo(
    () =>
      filterExams(exams, {
        search: searchTerm,
        subject: selectedSubject,
        type: selectedType
      }),
    [exams, searchTerm, selectedSubject, selectedType]
  );

  return (
    <div className="space-y-8">
      {/* Active Attempt Banner */}
      {activeAttempt && activeAttemptExam && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600/[0.15] via-[#0C0F16] to-[#0C0F16] border border-blue-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/35 text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-blue-400">
                অসমাপ্ত পরীক্ষা চলমান রয়েছে
              </div>
              <div className="text-sm font-bold text-slate-50 truncate">
                {activeAttemptExam.name}
              </div>
              <div className="text-xs text-slate-400 tabular-nums">
                অবশিষ্ট সময়:{" "}
                {toBanglaNum(Math.ceil(activeAttempt.examTimeRemaining / 60))}{" "}
                মিনিট
              </div>
            </div>
          </div>
          <Link
            href={`/exams/${activeAttempt.examId}/cbt`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0"
          >
            <span>পরীক্ষা চালিয়ে যান</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3.5">
        <span className="w-10 h-10 rounded-xl bg-blue-500/12 border border-blue-500/25 flex items-center justify-center shrink-0 mt-0.5">
          <FileText className="w-5 h-5 text-blue-400" />
        </span>
        <div>
          <p className="text-xs font-semibold text-blue-400">এক্সাম সেন্টার</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 leading-tight">
            সকল পরীক্ষা ও মডেল টেস্ট
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            লাইভ CBT এক্সাম, কুইক ড্রিল ও প্র্যাকটিস মোডে তাৎক্ষণিক ব্যাখ্যামূলক পরীক্ষা · মোট{" "}
            <span className="font-mono tabular-nums font-semibold text-slate-200">
              {toBanglaNum(exams.length)}টি
            </span>
          </p>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="p-4 rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] space-y-3.5">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="পরীক্ষার নাম, বিষয় বা অধ্যায় দিয়ে খুঁজুন..."
              aria-label="পরীক্ষা খুঁজুন"
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-white/[0.1] bg-[#131824] text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#131824] border border-white/[0.06] text-xs font-medium shrink-0 self-start md:self-auto">
            {[
              { id: "all", label: "সব ধরন" },
              { id: "cbt", label: "মডেল টেস্ট" },
              { id: "drill", label: "কুইক ড্রিল" }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setSelectedType(item.id as "all" | "cbt" | "drill")
                }
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  selectedType === item.id
                    ? "bg-[#1C2436] text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Subject Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 border-t border-white/[0.06] text-xs">
          <button
            type="button"
            onClick={() => setSelectedSubject("all")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
              selectedSubject === "all"
                ? "bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold"
                : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
            }`}
          >
            সকল বিষয় ({toBanglaNum(exams.length)})
          </button>
          {subjects.map((s) => {
            const count = exams.filter((e) => e.subject === s).length;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSubject(s)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  selectedSubject === s
                    ? "bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              course={courses.find((c) => c.id === exam.courseId)}
              activeAttempt={activeAttempt}
              hasCompleted={completedExamIds.has(exam.id)}
              bestScore={bestScoreByExam.get(exam.id)}
              latestResultId={latestResultByExam.get(exam.id)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-white/[0.12] bg-[#0C0F16]">
          <FileText className="w-9 h-9 mx-auto text-slate-500 mb-3" />
          <h3 className="text-base font-bold text-slate-100">
            কোনো পরীক্ষা পাওয়া যায়নি
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            অনুগ্রহ করে কি-ওয়ার্ড বা ফিল্টার পরিবর্তন করে চেষ্টা করুন
          </p>
          {(searchTerm || selectedSubject !== "all" || selectedType !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedSubject("all");
                setSelectedType("all");
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
