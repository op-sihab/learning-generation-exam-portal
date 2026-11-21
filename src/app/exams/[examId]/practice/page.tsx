"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { ExamRoom, ExamRoomSubmitPayload } from "@/components/exam/ExamRoom";
import { ActiveAttempt } from "@/types";

export default function PracticeExamPage() {
  const params = useParams();
  const router = useRouter();
  const {
    exams,
    soundEnabled,
    saveAttempt,
    submitExam,
    showToast
  } = usePortal();

  const [sessionStart] = useState(() => Date.now());

  const examId = params?.examId as string;
  const exam = useMemo(() => {
    return exams.find((e) => e.id === examId);
  }, [exams, examId]);

  const initialAttempt = useMemo<ActiveAttempt | null>(() => {
    if (!exam) return null;
    return {
      examId: exam.id,
      mode: "practice",
      currentQuestionIndex: 0,
      userAnswers: {},
      markedQuestions: {},
      questionTimes: {},
      examTimeRemaining: (exam.minutes || 30) * 60,
      startedAt: sessionStart
    };
  }, [exam, sessionStart]);

  if (!exam || !initialAttempt) {
    return (
      <div className="py-16 text-center rounded-2xl bg-[#0C0F16] border border-white/[0.08]">
        <div className="w-14 h-14 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          অনুশীলনী পরীক্ষাটি পাওয়া যায়নি
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          অনুরোধকৃত পরীক্ষাটি শুরু করা সম্ভব হচ্ছে না।
        </p>
        <Link
          href="/exams"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          সকল পরীক্ষায় ফিরে যান
        </Link>
      </div>
    );
  }

  const handleExit = () => {
    router.push(`/exams/${exam.id}`);
  };

  const handleSubmit = (payload: ExamRoomSubmitPayload) => {
    const res = submitExam(exam, "practice", payload);
    showToast("অনুশীলনী শেষ হয়েছে! ফলাফল সংরক্ষিত হলো।");
    router.push(`/results/${res.id}`);
  };

  return (
    <div className="py-2">
      <ExamRoom
        exam={exam}
        mode="practice"
        initialAttempt={initialAttempt}
        soundEnabled={soundEnabled}
        onSaveAttempt={saveAttempt}
        onExit={handleExit}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
