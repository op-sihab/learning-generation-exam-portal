"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Flag,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CircleCheck,
  CircleX,
  Minimize2,
  Maximize2,
  Type
} from "lucide-react";
import { Exam, ActiveAttempt, Violation } from "@/types";
import { MathText } from "@/components/math/MathText";
import { QuestionImages } from "./QuestionImages";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { formatTimer, toBanglaNum, getOptionLetter } from "@/utils/format";
import { playTone } from "@/utils/audio";

const MAX_WARNINGS = 3;

export interface ExamRoomSubmitPayload {
  answers: Record<number, number>;
  questionTimes: Record<number, number>;
  timeRemaining: number;
  violations?: Violation[];
  autoSubmitted?: boolean;
}

export interface ExamRoomProps {
  exam: Exam;
  mode: "live" | "practice";
  initialAttempt: ActiveAttempt;
  soundEnabled: boolean;
  onSaveAttempt: (attempt: ActiveAttempt) => void;
  onExit: (attempt: ActiveAttempt) => void;
  onSubmit: (payload: ExamRoomSubmitPayload) => void;
}

export const ExamRoom: React.FC<ExamRoomProps> = ({
  exam,
  mode,
  initialAttempt,
  soundEnabled,
  onSaveAttempt,
  onExit,
  onSubmit
}) => {
  const [currentIndex, setCurrentIndex] = useState(
    initialAttempt.currentQuestionIndex || 0
  );
  const [answers, setAnswers] = useState<Record<number, number>>(
    initialAttempt.userAnswers || {}
  );
  const [marked, setMarked] = useState<Record<number, boolean>>(
    initialAttempt.markedQuestions || {}
  );
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>(
    initialAttempt.questionTimes || {}
  );
  const [timeRemaining, setTimeRemaining] = useState(
    initialAttempt.examTimeRemaining
  );
  const [paletteFilter, setPaletteFilter] = useState<
    "all" | "unanswered" | "answered" | "marked"
  >("all");
  const [fontScale, setFontScale] = useState<"sm" | "md" | "lg">("md");
  const [violations, setViolations] = useState<Violation[]>([]);
  const [warnModalMsg, setWarnModalMsg] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const submittedRef = useRef(false);
  const answersRef = useRef(answers);
  const questionTimesRef = useRef(questionTimes);
  const timeRemainingRef = useRef(timeRemaining);
  const violationsRef = useRef(violations);
  const currentIndexRef = useRef(currentIndex);

  answersRef.current = answers;
  questionTimesRef.current = questionTimes;
  timeRemainingRef.current = timeRemaining;
  violationsRef.current = violations;
  currentIndexRef.current = currentIndex;

  const totalQuestions = exam.questions.length;
  const currentQuestion = exam.questions[currentIndex];

  const triggerFinalSubmit = useCallback(
    (autoSubmitted = false, overrideViolations?: Violation[]) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      playTone("finish", soundEnabled);
      if (typeof document !== "undefined" && document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
      onSubmit({
        answers: answersRef.current,
        questionTimes: questionTimesRef.current,
        timeRemaining: timeRemainingRef.current,
        violations: overrideViolations ?? violationsRef.current,
        autoSubmitted
      });
    },
    [onSubmit, soundEnabled]
  );

  // Sync attempt to parent state
  useEffect(() => {
    if (submittedRef.current) return;
    onSaveAttempt({
      examId: exam.id,
      mode,
      currentQuestionIndex: currentIndex,
      userAnswers: answers,
      markedQuestions: marked,
      questionTimes,
      examTimeRemaining: timeRemaining,
      startedAt: initialAttempt.startedAt
    });
  }, [
    exam.id,
    mode,
    currentIndex,
    answers,
    marked,
    questionTimes,
    timeRemaining,
    initialAttempt.startedAt,
    onSaveAttempt
  ]);

  // Main timer tick
  useEffect(() => {
    const id = window.setInterval(() => {
      if (submittedRef.current) return;

      setQuestionTimes((prev) => {
        const idx = currentIndexRef.current;
        return {
          ...prev,
          [idx]: (prev[idx] || 0) + 1
        };
      });

      if (mode === "live") {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            window.clearInterval(id);
            triggerFinalSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, [mode, triggerFinalSubmit]);

  // Anti-cheat / violations
  const recordViolation = useCallback(
    (message: string) => {
      if (mode !== "live" || submittedRef.current) return;
      playTone("warn", soundEnabled);

      setViolations((prev) => {
        const next: Violation[] = [
          ...prev,
          {
            type: "tab_switch",
            message,
            timestamp: Date.now()
          }
        ];
        violationsRef.current = next;
        setWarnModalMsg(message);

        if (next.length >= MAX_WARNINGS) {
          window.setTimeout(() => {
            triggerFinalSubmit(true, next);
          }, 1200);
        }
        return next;
      });
    },
    [mode, soundEnabled, triggerFinalSubmit]
  );

  useEffect(() => {
    if (mode !== "live") return;

    const onVisibility = () => {
      if (document.hidden) {
        recordViolation("অন্য ট্যাব বা অ্যাপে স্থানান্তর সনাক্ত হয়েছে");
      }
    };
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      recordViolation("রাইট ক্লিক / কনটেক্সট মেনু চেষ্টা");
    };
    const onCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      recordViolation("কপি বা পেস্ট করার চেষ্টা");
    };
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", onCopyPaste);
    document.addEventListener("paste", onCopyPaste);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", onCopyPaste);
      document.removeEventListener("paste", onCopyPaste);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [mode, recordViolation]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleSelectOption = useCallback(
    (optIndex: number) => {
      if (!currentQuestion) return;
      if (mode === "practice" && answers[currentIndex] !== undefined) return;

      setAnswers((prev) => ({
        ...prev,
        [currentIndex]: optIndex
      }));

      if (mode === "practice") {
        playTone(
          optIndex === currentQuestion.answer ? "correct" : "wrong",
          soundEnabled
        );
      } else {
        playTone("select", soundEnabled);
      }
    },
    [answers, currentIndex, currentQuestion, mode, soundEnabled]
  );

  const toggleMarkCurrent = useCallback(() => {
    setMarked((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex]
    }));
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showSubmitModal || showExitModal || warnModalMsg) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      ) {
        return;
      }

      if (/^[1-9]$/.test(e.key)) {
        const optIdx = Number(e.key) - 1;
        if (currentQuestion && optIdx < currentQuestion.options.length) {
          handleSelectOption(optIdx);
        }
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (e.key.toLowerCase() === "m") {
        toggleMarkCurrent();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    currentQuestion,
    handleSelectOption,
    showExitModal,
    showSubmitModal,
    toggleMarkCurrent,
    totalQuestions,
    warnModalMsg
  ]);

  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(marked).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;
  const progressPct = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const filteredQuestionIndices = useMemo(() => {
    return exam.questions
      .map((_, i) => i)
      .filter((i) => {
        if (paletteFilter === "answered") return answers[i] !== undefined;
        if (paletteFilter === "unanswered") return answers[i] === undefined;
        if (paletteFilter === "marked") return Boolean(marked[i]);
        return true;
      });
  }, [exam.questions, paletteFilter, answers, marked]);

  const selectedOption = answers[currentIndex];
  const showPracticeFeedback = mode === "practice" && selectedOption !== undefined;

  const qTextSize =
    fontScale === "sm"
      ? "text-base leading-relaxed"
      : fontScale === "lg"
      ? "text-xl sm:text-2xl leading-relaxed"
      : "text-lg sm:text-xl leading-relaxed";

  const isLowTime = mode === "live" && timeRemaining < 90;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="পরীক্ষা থেকে বের হন"
            title="পরীক্ষা সাময়িক স্থগিত করুন"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
              {exam.name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{exam.subject}</span>
              <span aria-hidden="true">•</span>
              <span>
                {mode === "live" ? "লাইভ সিকিউর মোড" : "প্র্যাকটিস ও ব্যাখ্যা মোড"}
              </span>
              {mode === "live" && (
                <>
                  <span aria-hidden="true">•</span>
                  <span
                    className={
                      violations.length > 0
                        ? "text-red-600 dark:text-red-400 font-semibold"
                        : "text-emerald-700 dark:text-emerald-400 font-medium"
                    }
                  >
                    সতর্কতা {toBanglaNum(violations.length)}/{toBanglaNum(MAX_WARNINGS)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Font Resizer */}
          <div className="hidden sm:flex items-center rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800/70">
            <button
              type="button"
              onClick={() => setFontScale("sm")}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors ${
                fontScale === "sm"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              title="ছোট ফন্ট"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontScale("md")}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors ${
                fontScale === "md"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              title="স্বাভাবিক ফন্ট"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setFontScale("lg")}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors ${
                fontScale === "lg"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              title="বড় ফন্ট"
            >
              A+
            </button>
          </div>

          {/* Fullscreen Button */}
          {mode === "live" && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              title="ফুলস্ক্রিন মোড"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
              <span>{isFullscreen ? "স্বাভাবিক" : "ফুলস্ক্রিন"}</span>
            </button>
          )}

          {/* Timer Display */}
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-sm sm:text-base font-bold tabular-nums border ${
              mode === "practice"
                ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                : isLowTime
                ? "bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 animate-pulse"
                : "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900/70 text-blue-700 dark:text-blue-300"
            }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>
              {mode === "practice"
                ? formatTimer(
                    Object.values(questionTimes).reduce((a, b) => a + b, 0)
                  )
                : formatTimer(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Question Area vs Palette Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        {/* Question Area */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          {/* Question Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                প্রশ্ন {toBanglaNum(currentIndex + 1)} / {toBanglaNum(totalQuestions)}
              </span>
              {currentQuestion?.topic && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>{currentQuestion.topic}</span>
                </>
              )}
              {currentQuestion?.difficulty && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>
                    {currentQuestion.difficulty === "easy"
                      ? "সহজ"
                      : currentQuestion.difficulty === "medium"
                      ? "মধ্যম"
                      : "কঠিন"}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              <span>নম্বর: {toBanglaNum(currentQuestion?.marks ?? exam.marks)}</span>
              <span aria-hidden="true">•</span>
              <span>সময়: {toBanglaNum(questionTimes[currentIndex] || 0)} সে.</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-4 mb-6">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Question Stem */}
          {currentQuestion && (
            <div>
              <h2 className={`font-semibold text-slate-900 dark:text-slate-100 ${qTextSize} mb-5`}>
                <span className="font-mono text-blue-600 dark:text-blue-400 mr-2 tabular-nums">
                  {toBanglaNum(currentIndex + 1)}.
                </span>
                <MathText text={currentQuestion.text} />
              </h2>

              {/* Question Image (if any) */}
              <QuestionImages images={currentQuestion.questionImages} />

              {/* Options List */}
              <div className="space-y-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.answer;

                  let optionStyle =
                    "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-500/70 text-slate-800 dark:text-slate-100";
                  let letterStyle =
                    "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700";

                  if (showPracticeFeedback) {
                    if (isCorrect) {
                      optionStyle =
                        "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-semibold";
                      letterStyle = "bg-emerald-600 text-white border-emerald-600";
                    } else if (isSelected && !isCorrect) {
                      optionStyle =
                        "border-red-500 bg-red-50/80 dark:bg-red-950/40 text-red-950 dark:text-red-100 font-semibold";
                      letterStyle = "bg-red-600 text-white border-red-600";
                    }
                  } else if (isSelected) {
                    optionStyle =
                      "border-blue-600 bg-blue-50/80 dark:bg-blue-950/45 text-blue-950 dark:text-blue-50 font-semibold ring-1 ring-blue-500";
                    letterStyle = "bg-blue-600 text-white border-blue-600";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full flex items-center gap-3.5 text-left rounded-2xl border px-4 py-3.5 transition-all duration-150 ${optionStyle}`}
                    >
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${letterStyle}`}
                      >
                        {getOptionLetter(idx)}
                      </span>
                      <span className="flex-1 min-w-0 text-sm sm:text-base font-medium">
                        <MathText text={opt} />
                      </span>
                      {showPracticeFeedback && isCorrect && (
                        <CircleCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {showPracticeFeedback && isSelected && !isCorrect && (
                        <CircleX className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Practice Feedback & Explanation */}
              {showPracticeFeedback && (
                <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-5 animate-in fade-in duration-150">
                  <div className="flex flex-wrap items-center gap-1.5 text-sm font-bold mb-2">
                    {selectedOption === currentQuestion.answer ? (
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CircleCheck className="w-4 h-4" />
                        <span>সঠিক উত্তর! চমৎকার হয়েছে।</span>
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                        <CircleX className="w-4 h-4" />
                        <span>
                          ভুল উত্তর — সঠিক উত্তর: {getOptionLetter(currentQuestion.answer)} (
                          <MathText
                            text={currentQuestion.options[currentQuestion.answer]}
                          />
                          )
                        </span>
                      </span>
                    )}
                  </div>
                  {currentQuestion.explanation && (
                    <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <strong className="text-slate-900 dark:text-slate-100">ব্যাখ্যা: </strong>
                      <MathText text={currentQuestion.explanation} />
                    </div>
                  )}
                </div>
              )}

              {/* Navigation and Action Bar */}
              <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>পূর্ববর্তী</span>
                </button>

                <div className="flex items-center gap-2">
                  {mode === "live" && selectedOption !== undefined && (
                    <button
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => {
                          const next = { ...prev };
                          delete next[currentIndex];
                          return next;
                        })
                      }
                      className="px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                    >
                      উত্তর মুছুন
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={toggleMarkCurrent}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      marked[currentIndex]
                        ? "border-amber-400 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                    <span>{marked[currentIndex] ? "মার্ক করা" : "রিভিউ মার্ক"}</span>
                  </button>
                </div>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 shadow-xs"
                  >
                    <span>পরবর্তী</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors whitespace-nowrap shrink-0 shadow-xs"
                  >
                    <span>উত্তরপত্র জমা দিন</span>
                    <CircleCheck className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Keyboard shortcuts reminder */}
              <div className="mt-4 hidden md:flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                <span>
                  শর্টকাট: ১–{toBanglaNum(Math.min(9, currentQuestion.options.length))} উত্তর নির্বাচন
                </span>
                <span>•</span>
                <span>← / → প্রশ্ন পরিবর্তন</span>
                <span>•</span>
                <span>M মার্ক</span>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Question Palette & Status */}
        <aside className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 lg:sticky lg:top-24 space-y-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                OMR প্রশ্ন প্যালেট
              </h3>
              <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                {toBanglaNum(answeredCount)}/{toBanglaNum(totalQuestions)} উত্তরিত
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 mt-3 text-[11px] font-semibold">
              {[
                { id: "all", label: "সব" },
                { id: "unanswered", label: "বাকি" },
                { id: "answered", label: "উত্তরিত" },
                { id: "marked", label: "মার্ক" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setPaletteFilter(
                      tab.id as "all" | "unanswered" | "answered" | "marked"
                    )
                  }
                  className={`py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    paletteFilter === tab.id
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
            {filteredQuestionIndices.length === 0 ? (
              <div className="col-span-5 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                এই ফিল্টারে কোনো প্রশ্ন নেই
              </div>
            ) : (
              filteredQuestionIndices.map((idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answers[idx] !== undefined;
                const isMarked = Boolean(marked[idx]);

                let cls =
                  "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-600";
                if (isCurrent) cls = "bg-blue-600 text-white border-blue-600 shadow-sm";
                else if (isMarked)
                  cls =
                    "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-400 font-bold";
                else if (isAnswered)
                  cls =
                    "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold";

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl border text-xs font-bold tabular-nums transition-colors ${cls}`}
                  >
                    {toBanglaNum(idx + 1)}
                  </button>
                );
              })
            )}
          </div>

          {/* Palette Legend */}
          <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
              <span>বর্তমান</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500 inline-block" />
              <span>উত্তরিত ({toBanglaNum(answeredCount)})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500 inline-block" />
              <span>মার্ক ({toBanglaNum(markedCount)})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700 inline-block" />
              <span>বাকি ({toBanglaNum(unansweredCount)})</span>
            </div>
          </div>

          {/* Security / Mode Note */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 p-3 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            {mode === "live" ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>সিকিউর মোড সক্রিয়। ৩ বার নিয়ম ভঙ্গ করলে পরীক্ষা অটো-সাবমিট হবে।</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>
                  প্র্যাকটিস মোড চালু আছে। প্রতিটি উত্তরের সাথে সাথে সঠিক ব্যাখ্যা দেখা যাবে।
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors shadow-sm"
          >
            পরীক্ষা জমা দিন
          </button>
        </aside>
      </div>

      {/* Warning Modal for Live Anti-Cheat */}
      {warnModalMsg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-red-300 dark:border-red-900 p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
              সিকিউর মোড সতর্কতা ({toBanglaNum(violations.length)}/{toBanglaNum(MAX_WARNINGS)})
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{warnModalMsg}</p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              {violations.length >= MAX_WARNINGS
                ? "সর্বোচ্চ সতর্কতা অতিক্রম করায় উত্তরপত্র স্বয়ংক্রিয়ভাবে জমা হচ্ছে..."
                : "পরীক্ষা চলাকালীন অন্য ট্যাবে যাওয়া বা কপি-পেস্ট করা সম্পূর্ণ নিষিদ্ধ।"}
            </p>
            {violations.length < MAX_WARNINGS && (
              <button
                type="button"
                onClick={() => setWarnModalMsg(null)}
                className="mt-5 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
                বুঝেছি, পরীক্ষায় ফিরে যান
              </button>
            )}
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      <ConfirmModal
        open={showSubmitModal}
        title="উত্তরপত্র জমা দিতে চান?"
        description={
          unansweredCount > 0
            ? `আপনার এখনো ${toBanglaNum(unansweredCount)}টি প্রশ্নের উত্তর দেওয়া বাকি আছে। জমা দেওয়ার পর উত্তর পরিবর্তন করা যাবে না।`
            : "আপনি সবগুলো প্রশ্নের উত্তর দিয়েছেন। চূড়ান্ত ফলাফল দেখতে উত্তরপত্র জমা দিন।"
        }
        confirmLabel="হ্যাঁ, জমা দিন"
        cancelLabel="আরও দেখুন"
        details={[
          { label: "উত্তরিত", value: toBanglaNum(answeredCount) },
          { label: "বাকি আছে", value: toBanglaNum(unansweredCount) },
          { label: "মার্ক করা", value: toBanglaNum(markedCount) }
        ]}
        onConfirm={() => {
          setShowSubmitModal(false);
          triggerFinalSubmit(false);
        }}
        onCancel={() => setShowSubmitModal(false)}
      />

      {/* Exit Confirmation Modal */}
      <ConfirmModal
        open={showExitModal}
        title="পরীক্ষা সাময়িক বন্ধ করবেন?"
        description="আপনার বর্তমান উত্তর ও অবশিষ্ট সময় সংরক্ষিত থাকবে। পরে পরীক্ষা তালিকা থেকে আবার চালিয়ে যেতে পারবেন।"
        confirmLabel="সংরক্ষণ করে বের হন"
        cancelLabel="পরীক্ষায় থাকুন"
        tone="info"
        onConfirm={() => {
          setShowExitModal(false);
          if (typeof document !== "undefined" && document.fullscreenElement) {
            document.exitFullscreen?.().catch(() => {});
          }
          onExit({
            examId: exam.id,
            mode,
            currentQuestionIndex: currentIndex,
            userAnswers: answers,
            markedQuestions: marked,
            questionTimes,
            examTimeRemaining: timeRemaining,
            startedAt: initialAttempt.startedAt
          });
        }}
        onCancel={() => setShowExitModal(false)}
      />
    </div>
  );
};
