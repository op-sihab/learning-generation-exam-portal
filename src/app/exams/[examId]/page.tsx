"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Clock,
  HelpCircle,
  Award,
  AlertOctagon,
  ShieldAlert,
  Play,
  RotateCcw,
  Trophy,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { toBanglaNum, formatDateBangla, getExamTotalMarks } from "@/utils/format";

export default function ExamBriefingPage() {
  const params = useParams();
  const router = useRouter();
  const { exams, activeAttempt, history } = usePortal();

  const examId = params?.examId as string;
  const exam = useMemo(() => {
    return exams.find((e) => e.id === examId);
  }, [exams, examId]);

  // Check if user already took this exam
  const pastAttempts = useMemo(() => {
    return history.filter((h) => h.examId === examId);
  }, [history, examId]);

  const hasActiveAttempt = activeAttempt?.examId === examId;

  if (!exam) {
    return (
      <div className="py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          পরীক্ষাটি পাওয়া যায়নি
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          অনুরোধকৃত পরীক্ষাটি অপসারিত হয়েছে অথবা লিংকটি ভুল।
        </p>
        <Link
          href="/exams"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          সকল পরীক্ষায় ফিরে যান
        </Link>
      </div>
    );
  }

  const totalMarks = getExamTotalMarks(exam);
  const totalQuestions = exam.questions.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <div>
        <Link
          href="/exams"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          সকল পরীক্ষায় ফিরুন
        </Link>
      </div>

      {/* Main Briefing Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Title & Badge */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                {exam.subject}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {exam.type || "CBT Exam"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {exam.name}
            </h1>
            {exam.chapter && (
              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                <span>অধ্যায় / সিলেবাস: {exam.chapter}</span>
              </p>
            )}
          </div>

          <Link
            href={`/leaderboard?examId=${exam.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors shrink-0 self-start"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            মেরিট লিস্ট
          </Link>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              সময়কাল
            </div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {toBanglaNum(exam.minutes)} মিনিট
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
              মোট প্রশ্ন
            </div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {toBanglaNum(totalQuestions)} টি
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Award className="w-3.5 h-3.5 text-indigo-500" />
              পূর্ণমান
            </div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {toBanglaNum(totalMarks)} নম্বর
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
              নেগেটিভ মার্ক
            </div>
            <div className="text-base sm:text-lg font-extrabold text-rose-600 dark:text-rose-400">
              {exam.negative ? `-${toBanglaNum(exam.negative)}` : "নেই"}
            </div>
          </div>
        </div>

        {/* Instructions & Anti-cheat notice */}
        <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-200 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-300">
            <ShieldAlert className="w-4 h-4" />
            লাইভ পরীক্ষার গুরুত্বপূর্ণ নিয়মাবলী
          </div>
          <ul className="text-xs sm:text-sm space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-300">
            <li>লাইভ CBT মোডে পরীক্ষা শুরু করার পর ট্যাব পরিবর্তন বা স্ক্রিন ছোট করা যাবে না।</li>
            <li>ট্যাব স্যুইচ করলে সর্বোচ্চ ৩ বার সতর্কবার্তা দেওয়া হবে, অন্যথায় পরীক্ষা স্বয়ংক্রিয়ভাবে সাবমিট হয়ে যাবে।</li>
            <li>কীবোর্ড শর্টকাট: <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-xs">1</kbd> থেকে <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-xs">4</kbd> চেপে অপশন সিলেক্ট করা যায় এবং <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-xs">M</kbd> দিয়ে রিভিউ মার্ক করা যায়।</li>
            <li>প্র্যাকটিস মোডে কোনো সময়সীমা বা অ্যান্টি-চিট নেই; সাথে সাথে সঠিক উত্তর ও KaTeX গাণিতিক ব্যাখ্যা দেখা যায়।</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          {hasActiveAttempt ? (
            <Link
              href={`/exams/${exam.id}/cbt`}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:from-amber-700 hover:to-amber-600 transition-all"
            >
              <RotateCcw className="w-5 h-5 animate-spin-slow" />
              অসমাপ্ত পরীক্ষাটি পুনরায় চালু করুন
            </Link>
          ) : (
            <Link
              href={`/exams/${exam.id}/cbt`}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-emerald-600 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              লাইভ CBT পরীক্ষা শুরু করুন
            </Link>
          )}

          <Link
            href={`/exams/${exam.id}/practice`}
            className="flex-1 py-3.5 px-6 rounded-2xl border-2 border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold text-center flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all"
          >
            প্র্যাকটিস মোড (ব্যাখ্যামূলক)
          </Link>
        </div>
      </div>

      {/* Past attempts list if available */}
      {pastAttempts.length > 0 && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            এই পরীক্ষায় আপনার পূর্ববর্তী অংশগ্রহণের রেকর্ড ({toBanglaNum(pastAttempts.length)})
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {pastAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="py-3 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    তারিখ: {formatDateBangla(attempt.dateISO)}
                  </div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    স্কোর: {toBanglaNum(attempt.score)}/{toBanglaNum(attempt.total)} • নির্ভুলতা: {toBanglaNum(attempt.accuracy)}%
                  </div>
                </div>
                <Link
                  href={`/results/${attempt.id}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                >
                  বিস্তারিত ফলাফল →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
