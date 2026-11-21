"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Play,
  ArrowRight,
  Clock,
  Search,
  Trophy,
  Flame,
  Target,
  BookOpen,
  CheckCircle2
} from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { CourseCard } from "@/components/course/CourseCard";
import { ExamCard } from "@/components/exam/ExamCard";
import { getGreetingBangla, toBanglaNum } from "@/utils/format";
import { filterExams } from "@/utils/portalHelpers";

export default function HomePage() {
  const {
    activeUser,
    activeAttempt,
    courses,
    exams,
    stats,
    history,
    streak,
    bestScoreByExam,
    latestResultByExam
  } = usePortal();

  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activeAttemptExam = activeAttempt
    ? exams.find((e) => e.id === activeAttempt.examId)
    : null;

  const publishedExams = useMemo(
    () => exams.filter((e) => e.published),
    [exams]
  );

  const allSubjects = useMemo(
    () => Array.from(new Set(publishedExams.map((e) => e.subject))),
    [publishedExams]
  );

  const filteredExams = useMemo(
    () =>
      filterExams(publishedExams, {
        subject: selectedSubject,
        search: searchQuery
      }),
    [publishedExams, selectedSubject, searchQuery]
  );

  const completedExamIds = useMemo(
    () => new Set(history.map((h) => h.examId)),
    [history]
  );

  const todayISO = new Date().toISOString().slice(0, 10);
  const examsToday = history.filter(
    (h) => h.dateISO.slice(0, 10) === todayISO
  ).length;
  const dailyGoal = activeUser.dailyGoalExams || 2;
  const goalPct = Math.min(
    100,
    Math.round((examsToday / Math.max(1, dailyGoal)) * 100)
  );

  const ringRadius = 32;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference - (ringCircumference * goalPct) / 100;

  return (
    <div className="space-y-12">
      {/* Active Paused Attempt Banner */}
      {activeAttempt && activeAttemptExam && (
        <section className="rounded-2xl bg-gradient-to-r from-blue-600/[0.15] via-[#0C0F16] to-[#0C0F16] border border-blue-500/35 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/35 text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-blue-400">
                চলমান পরীক্ষা সংরক্ষিত আছে
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-50 truncate">
                {activeAttemptExam.name}
              </h2>
              <p className="text-xs text-slate-400 tabular-nums">
                {toBanglaNum(Object.keys(activeAttempt.userAnswers).length)}টি উত্তরিত · অবশিষ্ট{" "}
                {toBanglaNum(Math.ceil(activeAttempt.examTimeRemaining / 60))} মিনিট
              </p>
            </div>
          </div>

          <Link
            href={`/exams/${activeAttemptExam.id}/cbt`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <span>পরীক্ষা চালিয়ে যান</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      )}

      {/* Hero Section + Daily Readiness Telemetry */}
      <section className="space-y-4">
        <div className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] p-6 sm:p-8 lg:p-10 relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/[0.08] blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Greeting, Context & Primary Action */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="text-blue-400 font-semibold">
                    {activeUser.targetBatch}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">
                    ·
                  </span>
                  <span className="tabular-nums">
                    {toBanglaNum(publishedExams.length)}টি মডেল টেস্ট প্রস্তুত
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-bold text-slate-50 leading-tight max-w-2xl">
                  {getGreetingBangla()}, {activeUser.name}
                </h1>

                <p className="text-sm sm:text-[15px] text-slate-400 leading-relaxed max-w-xl">
                  বোর্ড ও ভর্তি পরীক্ষার নিখুঁত প্রস্তুতির জন্য অধ্যায়ভিত্তিক সিকিউর CBT মডেল টেস্ট,
                  গাণিতিক ও রাসায়নিক ব্যাখ্যা এবং সময়-ভিত্তিক পারফরম্যান্স বিশ্লেষণ।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/exams"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors whitespace-nowrap shadow-lg shadow-blue-600/20"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>মডেল টেস্ট শুরু করুন</span>
                </Link>

                <Link
                  href="/leaderboard"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.1] bg-[#131824] hover:bg-[#181F2E] hover:border-white/[0.16] text-slate-200 text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>মেরিট লিডারবোর্ড</span>
                </Link>
              </div>
            </div>

            {/* Right: Sleek Obsidian Readiness Telemetry Panel */}
            <div className="lg:col-span-4 rounded-xl bg-[#111622] border border-white/[0.08] p-5 flex flex-col justify-between gap-5">
              <div className="flex items-center gap-4">
                {/* Circular Progress Gauge */}
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r={ringRadius}
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r={ringRadius}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                    />
                  </svg>
                  <span className="absolute font-mono text-sm font-bold text-slate-50 tabular-nums">
                    {toBanglaNum(examsToday)}/{toBanglaNum(dailyGoal)}
                  </span>
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="text-xs font-semibold text-slate-200">
                    আজকের অনুশীলন লক্ষ্য
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {examsToday >= dailyGoal
                      ? "আজকের লক্ষ্য সম্পন্ন হয়েছে!"
                      : `লক্ষ্য পূরণে আরও ${toBanglaNum(
                          dailyGoal - examsToday
                        )}টি পরীক্ষা বাকি`}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between text-xs">
                <div className="inline-flex items-center gap-2 font-semibold text-amber-400 tabular-nums">
                  <Flame className="w-4 h-4" />
                  <span>{toBanglaNum(streak.count)} দিনের ধারাবাহিকতা</span>
                </div>
                <Link
                  href="/analytics"
                  className="font-semibold text-blue-400 hover:text-blue-300 whitespace-nowrap transition-colors"
                >
                  অগ্রগতি →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Hairline KPI Strip with Framed Icons */}
        <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-white/[0.07] grid grid-cols-2 lg:grid-cols-4 gap-px">
          <div className="p-5 bg-[#0C0F16] flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-medium text-slate-400 block">
                পরীক্ষা সম্পন্ন
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-slate-50 tabular-nums">
                  {toBanglaNum(stats.total)}
                </span>
                <span className="text-xs text-slate-400">টি</span>
              </div>
            </div>
            <span className="w-9 h-9 rounded-xl bg-blue-500/12 border border-blue-500/25 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-blue-400" />
            </span>
          </div>

          <div className="p-5 bg-[#0C0F16] flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-xs font-medium text-slate-400 block">
                গড় সঠিকতা
              </span>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  {toBanglaNum(stats.avg)}%
                </span>
                <span className="text-[11px] text-slate-400 tabular-nums whitespace-nowrap">
                  সেরা {toBanglaNum(stats.best)}%
                </span>
              </div>
            </div>
            <span className="w-9 h-9 rounded-xl bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-emerald-400" />
            </span>
          </div>

          <div className="p-5 bg-[#0C0F16] flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-medium text-slate-400 block">
                স্টাডি স্ট্রিক
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  {toBanglaNum(streak.count)}
                </span>
                <span className="text-xs text-slate-400">দিন</span>
              </div>
            </div>
            <span className="w-9 h-9 rounded-xl bg-amber-500/12 border border-amber-500/25 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-amber-400" />
            </span>
          </div>

          <div className="p-5 bg-[#0C0F16] flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-medium text-slate-400 block">
                অনুশীলন সময়
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-slate-50 tabular-nums">
                  {toBanglaNum(stats.mins)}
                </span>
                <span className="text-xs text-slate-400">মিনিট</span>
              </div>
            </div>
            <span className="w-9 h-9 rounded-xl bg-indigo-500/12 border border-indigo-500/25 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-indigo-400" />
            </span>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-50">
              কোর্স ও ব্যাচসমূহ
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              অধ্যায়ভিত্তিক প্রশ্নব্যাংক ও ধারাবাহিক মডেল টেস্ট সিরিজ
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 whitespace-nowrap shrink-0 transition-colors"
          >
            <span>সকল কোর্স</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course, idx) => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={course.name === activeUser.targetBatch}
              priority={idx === 0}
            />
          ))}
        </div>
      </section>

      {/* Model Tests & Exams Section */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-50">
              লাইভ ও অধ্যায়ভিত্তিক মডেল টেস্ট
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              সময়ানুবর্তী CBT মোড বা ব্যাখ্যাসহ প্র্যাকটিস মোডে অংশগ্রহণ করুন
            </p>
          </div>

          <Link
            href="/exams"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 whitespace-nowrap shrink-0 transition-colors"
          >
            <span>সকল পরীক্ষা</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dedicated Search & Subject Filter Toolbar */}
        <div className="p-3.5 rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পরীক্ষা বা অধ্যায় খুঁজুন..."
              aria-label="পরীক্ষা খুঁজুন"
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-white/[0.1] bg-[#131824] text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#131824] border border-white/[0.06] overflow-x-auto no-scrollbar text-xs font-medium">
            <button
              type="button"
              onClick={() => setSelectedSubject("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedSubject === "all"
                  ? "bg-[#1C2436] text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              সব বিষয়
            </button>
            {allSubjects.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedSubject === sub
                    ? "bg-[#1C2436] text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExams.map((exam) => {
              const course = courses.find((c) => c.id === exam.courseId);
              const hasCompleted = completedExamIds.has(exam.id);
              const bestScore = bestScoreByExam.get(exam.id);
              const latestResultId = latestResultByExam.get(exam.id);

              return (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  course={course}
                  activeAttempt={activeAttempt}
                  hasCompleted={hasCompleted}
                  bestScore={bestScore}
                  latestResultId={latestResultId}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#0C0F16] border border-dashed border-white/[0.12] p-10 text-center space-y-2.5">
            <CheckCircle2 className="w-8 h-8 mx-auto text-slate-500" />
            <p className="text-sm font-semibold text-slate-200">
              এই ফিল্টারে কোনো পরীক্ষা পাওয়া যায়নি
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedSubject("all");
                setSearchQuery("");
              }}
              className="mt-1 px-4 py-2 rounded-xl bg-[#131824] border border-white/[0.1] text-xs font-semibold text-slate-200 hover:bg-[#181F2E] transition-colors"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
