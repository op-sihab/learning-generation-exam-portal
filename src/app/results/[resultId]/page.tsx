"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Award, FileText } from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { ResultView } from "@/components/result/ResultView";

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { history, exams } = usePortal();

  const resultId = params?.resultId as string;
  const result = useMemo(() => {
    return history.find((h) => h.id === resultId);
  }, [history, resultId]);

  const exam = useMemo(() => {
    if (!result) return undefined;
    return exams.find((e) => e.id === result.examId);
  }, [exams, result]);

  if (!result) {
    return (
      <div className="py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          ফলাফল পাওয়া যায়নি
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          অনুরোধকৃত পরীক্ষার ফলাফলটি সংরক্ষিত তালিকায় নেই।
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          ড্যাশবোর্ডে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <Link
          href="/analytics"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          সকল ফলাফলে ফিরুন
        </Link>
      </div>

      <ResultView
        result={result}
        exam={exam}
        onRetake={(examId) => router.push(`/exams/${examId}`)}
        onOpenLeaderboard={(examId) => router.push(`/leaderboard?examId=${examId}`)}
        onBack={() => router.push("/")}
      />
    </div>
  );
}
