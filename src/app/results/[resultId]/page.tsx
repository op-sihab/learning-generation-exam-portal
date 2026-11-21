"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Award } from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { ResultView } from "@/components/result/ResultView";

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { history, exams } = usePortal();

  const resultId = params?.resultId as string;
  const result = useMemo(
    () => history.find((h) => h.id === resultId),
    [history, resultId]
  );

  const exam = useMemo(() => {
    if (!result) return undefined;
    return exams.find((e) => e.id === result.examId);
  }, [exams, result]);

  if (!result) {
    return (
      <div className="py-16 text-center space-y-3 rounded-2xl bg-[#0C0F16] border border-white/[0.08]">
        <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 flex items-center justify-center mx-auto">
          <Award className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">
          ফলাফল পাওয়া যায়নি
        </h2>
        <p className="text-sm text-slate-400">
          অনুরোধকৃত পরীক্ষার ফলাফলটি সংরক্ষিত তালিকায় নেই।
        </p>
        <div className="pt-2">
          <Link
            href="/analytics"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ফলাফল বিশ্লেষণে ফিরে যান</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ResultView
        result={result}
        exam={exam}
        onRetake={(examId) => router.push(`/exams/${examId}`)}
        onOpenLeaderboard={(examId) => router.push(`/leaderboard?examId=${examId}`)}
        onBack={() => router.push("/analytics")}
      />
    </div>
  );
}
