"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Play,
  ArrowRight,
  BookOpen,
  Trophy,
  BarChart3,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  Flame,
  Search
} from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { CourseCard } from "@/components/course/CourseCard";
import { ExamCard } from "@/components/exam/ExamCard";
import {
  getGreetingBangla,
  toBanglaNum
} from "@/utils/format";

export default function HomePage() {
  const {
    activeUser,
    activeAttempt,
    courses,
    exams,
    stats,
    history,
    streak,
    bestScoreByExam
  } = usePortal();

  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activeAttemptExam = activeAttempt
    ? exams.find((e) => e.id === activeAttempt.examId)
    : null;

  const allSubjects = Array.from(
    new Set(exams.filter((e) => e.published).map((e) => e.subject))
  );

  const filteredExams = exams
    .filter((e) => e.published)
    .filter((e) => {
      if (selectedSubject !== "all" && e.subject !== selectedSubject) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.name.toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q) ||
          e.chapter.toLowerCase().includes(q)
        );
      }
      return true;
    });

  const completedExamIds = new Set(history.map((h) => h.examId));

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-blue-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{activeUser.targetBatch}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {getGreetingBangla()}, {activeUser.name}!
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-xl">
            বোর্ড ও ভর্তি পরীক্ষার সেরা প্রস্তুতির জন্য অধ্যায়ভিত্তিক CBT মডেল টেস্ট,
            লাইভ টাইমার, সঠিকতার গ্রাফ এবং বিস্তারিত ব্যাখ্যা পর্যালোচনা করুন।
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/exams"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs sm:text-sm font-bold shadow-md hover:scale-105 transition-all"
            >
              <Play className="w-4 h-4 fill-blue-700" />
              <span>মডেল টেস্ট শুরু করুন</span>
            </Link>

            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold backdrop-blur-xs border border-white/20 transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>মেরিট লিস্ট দেখুন</span>
            </Link>
          </div>
        </div>

        {/* Background decorative SVG circles */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-20 top-5 w-48 h-48 rounded-full bg-indigo-400/20 blur-xl pointer-events-none" />
      </section>

      {/* Active In-Progress Attempt Alert */}
      {activeAttempt && activeAttemptExam && (
        <section className="p-5 rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border-2 border-purple-400 dark:border-purple-600 shadow-md flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/30">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                চলমান সেশন সংরক্ষিত আছে
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {activeAttemptExam.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                আপনি {toBanglaNum(Object.keys(activeAttempt.userAnswers).length)}টি প্রশ্নের
                উত্তর দিয়েছেন • অবশিষ্ট সময় আছে
              </p>
            </div>
          </div>

          <Link
            href={`/exams/${activeAttemptExam.id}/cbt`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all shrink-0"
          >
            <span>পরীক্ষা চালিয়ে যান</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      )}

      {/* Overview Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              পরীক্ষা সম্পন্ন
            </span>
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
              {toBanglaNum(stats.total)}
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              গড় সঠিকতা
            </span>
            <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              {toBanglaNum(stats.avg)}%
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              স্টাডি স্ট্রিক
            </span>
            <span className="text-2xl font-extrabold font-mono text-amber-500 tabular-nums">
              {toBanglaNum(streak.count)} দিন
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              অনুশীলন সময়
            </span>
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
              {toBanglaNum(stats.mins)} মি.
            </span>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>জনপ্রিয় কোর্স ও ব্যাচসমূহ</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              অধ্যায়ভিত্তিক প্রশ্নব্যাংক ও ধারাবাহিক মডেল টেস্ট সিরিজ
            </p>
          </div>

          <Link
            href="/courses"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>সকল কোর্স</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={course.name === activeUser.targetBatch}
            />
          ))}
        </div>
      </section>

      {/* Model Tests & Exams Section */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>লাইভ ও অধ্যায়ভিত্তিক মডেল টেস্ট</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              সময়ানুবর্তী CBT মোড বা ব্যাখ্যাসহ প্র্যাকটিস মোডে অংশ নিন
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="পরীক্ষা খুঁজুন..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedSubject("all")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedSubject === "all"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                সব বিষয়
              </button>
              {allSubjects.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    selectedSubject === sub
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => {
            const course = courses.find((c) => c.id === exam.courseId);
            const hasCompleted = completedExamIds.has(exam.id);
            const bestScore = bestScoreByExam.get(exam.id);

            return (
              <ExamCard
                key={exam.id}
                exam={exam}
                course={course}
                activeAttempt={activeAttempt}
                hasCompleted={hasCompleted}
                bestScore={bestScore}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
