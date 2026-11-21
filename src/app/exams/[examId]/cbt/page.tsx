"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { ExamRoom, ExamRoomSubmitPayload } from "@/components/exam/ExamRoom";
import { ActiveAttempt } from "@/types";

export default function LiveCbtExamPage() {
  const params = useParams();
  const router = useRouter();
  const {
    exams,
    activeAttempt,
    soundEnabled,
    saveAttempt,
    submitExam,
    showToast
  } = usePortal();

  const examId = params?.examId as string;
  const exam = useMemo(() => {
    return exams.find((e) => e.id === examId);
  }, [exams, examId]);

  const initialAttempt = useMemo<ActiveAttempt | null>(() => {
    if (!exam) return null;
    if (activeAttempt && activeAttempt.examId === exam.id) {
      return activeAttempt;
    }
    return {
      examId: exam.id,
      mode: "live",
      currentQuestionIndex: 0,
      userAnswers: {},
      markedQuestions: {},
      questionTimes: {},
      examTimeRemaining: (exam.minutes || 20) * 60,
      startedAt: Date.now()
    };
  }, [exam, activeAttempt]);

  if (!exam || !initialAttempt) {
    return (
      <div className="py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          পরীক্ষাটি পাওয়া যায়নি
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          অনুরোধকৃত পরীক্ষাটি শুরু করা সম্ভব হচ্ছে না।
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

  const handleExit = (att: ActiveAttempt) => {
    saveAttempt(att);
    showToast("পরীক্ষা সাময়িকভাবে স্থগিত ও সংরক্ষিত হয়েছে");
    router.push(`/exams/${exam.id}`);
  };

  const handleSubmit = (payload: ExamRoomSubmitPayload) => {
    const res = submitExam(exam, "live", payload);
    showToast("পরীক্ষা সফলভাবে জমা দেওয়া হয়েছে!");
    router.push(`/results/${res.id}`);
  };

  return (
    <div className="py-2">
      <ExamRoom
        exam={exam}
        mode="live"
        initialAttempt={initialAttempt}
        soundEnabled={soundEnabled}
        onSaveAttempt={saveAttempt}
        onExit={handleExit}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
