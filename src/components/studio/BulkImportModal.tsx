"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  AlertTriangle,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
  Trash2,
  Sigma,
  X,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Course, Exam, Question } from "@/types";
import {
  parseBulkImportFile,
  parseTextQuestions,
  ParseResult
} from "@/utils/bulkImport";
import { MathText } from "@/components/math/MathText";
import { FormulaEditorModal } from "@/components/math/FormulaEditorModal";
import { toBanglaNum, getOptionLetter } from "@/utils/format";
import { enrichQuestionFormulas } from "@/utils/math";

export interface BulkImportModalProps {
  open: boolean;
  courses: Course[];
  exams: Exam[];
  activeEditingExam?: Exam | null;
  onImportIntoEditingExam?: (questions: Question[]) => void;
  onAppendToExistingExam?: (examId: string, questions: Question[]) => void;
  onCreateNewExamWithQuestions?: (exam: Exam) => void;
  onImportFullExams?: (exams: Exam[]) => void;
  onClose: () => void;
}

function buildImportedExam(params: {
  name: string;
  courseId: string;
  subject: string;
  chapter: string;
  questions: Question[];
}): Exam {
  const now = Date.now();
  return {
    id: `exam_${now}`,
    name: params.name.trim() || "ইমপোর্ট করা মডেল টেস্ট",
    courseId: params.courseId,
    subject: params.subject || "পদার্থবিজ্ঞান",
    chapter: params.chapter || "অধ্যায়ভিত্তিক",
    type: "Model Test",
    minutes: Math.max(5, Math.round(params.questions.length * 0.75)),
    marks: 1,
    negative: 0.25,
    startTime: new Date(now).toISOString().slice(0, 16),
    endTime: new Date(now + 30 * 864e5).toISOString().slice(0, 16),
    retakeAllowed: true,
    published: true,
    instructions: [
      `মোট প্রশ্ন: ${params.questions.length}টি।`,
      "প্রতিটি সঠিক উত্তরের জন্য ১ নম্বর, ভুল উত্তরের জন্য ০.২৫ নম্বর কাটা যাবে।"
    ],
    questions: params.questions
  };
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  open,
  courses,
  exams,
  activeEditingExam,
  onImportIntoEditingExam,
  onAppendToExistingExam,
  onCreateNewExamWithQuestions,
  onImportFullExams,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [draftQuestions, setDraftQuestions] = useState<Question[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewExpanded, setPreviewExpanded] = useState<Record<string, boolean>>({});
  const [destMode, setDestMode] = useState<"editing" | "new_exam" | "append" | "full_exams">(
    activeEditingExam ? "editing" : "new_exam"
  );
  const [targetExamId, setTargetExamId] = useState(exams[0]?.id || "");
  const [newExamName, setNewExamName] = useState("");
  const [newExamCourseId, setNewExamCourseId] = useState(courses[0]?.id || "frpb");
  const [newExamSubject] = useState(
    activeEditingExam?.subject || courses[0]?.subjects[0]?.name || "পদার্থবিজ্ঞান"
  );
  const [newExamChapter] = useState(activeEditingExam?.chapter || "");
  const [formulaTarget, setFormulaTarget] = useState<{
    qIdx: number;
    field: "text" | "explanation" | "option";
    optIdx?: number;
    label: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const applyParsedResult = (res: ParseResult, sourceLabel: string) => {
    setParseResult(res);
    setDraftQuestions(res.questions);
    setSelectedIds(new Set(res.questions.map((q) => q.id)));
    if (!newExamName) {
      setNewExamName(sourceLabel.replace(/\.[^.]+$/, "") || "ইমপোর্ট করা পরীক্ষা");
    }
    if (activeEditingExam && onImportIntoEditingExam) {
      setDestMode("editing");
    } else if (res.fullExams && res.fullExams.length > 0) {
      setDestMode("full_exams");
    } else {
      setDestMode("new_exam");
    }
  };

  const handleFileSelected = async (file: File) => {
    setErrorMsg(null);
    setLoading(true);
    setFileName(file.name);
    try {
      const res = await parseBulkImportFile(file, {
        subject: activeEditingExam?.subject || newExamSubject,
        chapter: activeEditingExam?.chapter || newExamChapter
      });
      applyParsedResult(res, file.name);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "ফাইল বিশ্লেষণ করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleParsePastedText = () => {
    if (!pasteText.trim()) return;
    setErrorMsg(null);
    setFileName("পেস্ট করা প্রশ্নপত্র");
    const res = parseTextQuestions(pasteText, {
      subject: activeEditingExam?.subject || newExamSubject,
      chapter: activeEditingExam?.chapter || newExamChapter
    });
    applyParsedResult(res, "পেস্ট করা পরীক্ষা");
  };

  const updateDraft = (idx: number, patch: Partial<Question>) => {
    setDraftQuestions((prev) => {
      const next = [...prev];
      next[idx] = enrichQuestionFormulas({
        ...next[idx],
        ...patch
      });
      return next;
    });
  };

  const handleFormulaInsert = (formatted: string) => {
    if (!formulaTarget) return;
    const q = draftQuestions[formulaTarget.qIdx];
    if (!q) return;

    if (formulaTarget.field === "text") {
      const nextText = q.text ? `${q.text} ${formatted}` : formatted;
      updateDraft(formulaTarget.qIdx, { text: nextText });
    } else if (formulaTarget.field === "explanation") {
      const nextExp = q.explanation ? `${q.explanation} ${formatted}` : formatted;
      updateDraft(formulaTarget.qIdx, { explanation: nextExp });
    } else if (formulaTarget.field === "option" && formulaTarget.optIdx !== undefined) {
      const nextOpts = [...q.options];
      const cur = nextOpts[formulaTarget.optIdx] || "";
      nextOpts[formulaTarget.optIdx] = cur ? `${cur} ${formatted}` : formatted;
      updateDraft(formulaTarget.qIdx, { options: nextOpts });
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === draftQuestions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(draftQuestions.map((q) => q.id)));
    }
  };

  const selectedQuestions = draftQuestions.filter((q) => selectedIds.has(q.id));

  const handleConfirmImport = () => {
    if (destMode === "full_exams" && parseResult?.fullExams?.length && onImportFullExams) {
      onImportFullExams(parseResult.fullExams);
      onClose();
      return;
    }

    if (selectedQuestions.length === 0) {
      setErrorMsg("সংরক্ষণের জন্য কমপক্ষে ১টি বৈধ প্রশ্ন নির্বাচন করুন।");
      return;
    }

    if (destMode === "editing" && onImportIntoEditingExam) {
      onImportIntoEditingExam(selectedQuestions);
      onClose();
      return;
    }

    if (destMode === "append" && targetExamId && onAppendToExistingExam) {
      onAppendToExistingExam(targetExamId, selectedQuestions);
      onClose();
      return;
    }

    if (onCreateNewExamWithQuestions) {
      const course = courses.find((c) => c.id === newExamCourseId) || courses[0];
      onCreateNewExamWithQuestions(
        buildImportedExam({
          name: newExamName,
          courseId: course?.id || "frpb",
          subject: newExamSubject,
          chapter: newExamChapter,
          questions: selectedQuestions
        })
      );
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0C0F16] border border-white/[0.10] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/25 text-blue-400">
                <Upload className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">
                  বাল্ক প্রশ্নপত্র ও ডকুমেন্ট ইমপোর্ট
                </h3>
                <p className="text-xs text-slate-400">
                  DOCX, CSV, TXT, JSON, HTML ফাইল বা টেক্সট পেস্ট করে প্রশ্ন যোগ করুন
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center justify-between px-6 py-2.5 bg-[#111622] border-b border-white/[0.08]">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setPasteMode(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  !pasteMode
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-white/[0.06]"
                }`}
              >
                ফাইল আপলোড (DOCX / CSV / JSON / TXT)
              </button>
              <button
                type="button"
                onClick={() => setPasteMode(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  pasteMode
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-white/[0.06]"
                }`}
              >
                সরাসরি টেক্সট পেস্ট
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {!parseResult && !pasteMode && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-10 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center gap-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx,.csv,.json,.txt,.html,.htm"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelected(f);
                  }}
                />
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                  {loading ? (
                    <Loader2 className="w-7 h-7 animate-spin" />
                  ) : (
                    <Upload className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    ফাইল ড্রপ করুন অথবা ব্রাউজ করুন
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    মাইক্রোসফট ওয়ার্ড (.docx), CSV, JSON, HTML বা TXT ফরম্যাট সমর্থিত
                  </p>
                </div>
              </div>
            )}

            {!parseResult && pasteMode && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>প্রশ্ন, ৪টি অপশন এবং ব্যাখ্যা পেস্ট করুন:</span>
                  <span className="font-mono text-[11px]">LaTeX $...$ সমর্থিত</span>
                </div>
                <textarea
                  rows={8}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={`১. নিচের কোন অঙ্গাণুটিতে ক্রিস্টি বিদ্যমান?
ক) ক্লোরোপ্লাস্ট
খ) মাইটোকন্ড্রিয়া (*)
গ) রাইবোসোম
ঘ) লাইসোজোম
উত্তর: খ
ব্যাখ্যা: মাইটোকন্ড্রিয়ার অন্তর্বর্তী পর্দা ভাঁজ হয়ে ক্রিস্টি গঠন করে।`}
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 leading-relaxed"
                />
                <button
                  type="button"
                  onClick={handleParsePastedText}
                  disabled={!pasteText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors disabled:opacity-40"
                >
                  টেক্সট পার্স করুন
                </button>
              </div>
            )}

            {/* Parsed Result & Questions Preview */}
            {parseResult && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {fileName} থেকে {toBanglaNum(draftQuestions.length)}টি প্রশ্ন শনাক্ত হয়েছে
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {toBanglaNum(selectedIds.size)}টি প্রশ্ন নির্বাচনের জন্য প্রস্তুত
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-300 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100/60"
                    >
                      {selectedIds.size === draftQuestions.length ? (
                        <>
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>সব বাদ দিন</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-3.5 h-3.5" />
                          <span>সব নির্বাচন</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setParseResult(null);
                        setDraftQuestions([]);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      পুনরায় আপলোড
                    </button>
                  </div>
                </div>

                {/* Target Destination Choice */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    প্রশ্নগুলো কোথায় সংরক্ষণ করবেন?
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeEditingExam && (
                      <button
                        type="button"
                        onClick={() => setDestMode("editing")}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                          destMode === "editing"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <div className="font-bold">বর্তমান এডিটিং পরীক্ষা</div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {activeEditingExam.name}
                        </div>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDestMode("new_exam")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        destMode === "new_exam"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <div className="font-bold">নতুন পরীক্ষা তৈরি করুন</div>
                      <div className="text-[10px] text-slate-400">
                        ইমপোর্ট করা প্রশ্ন দিয়ে সম্পূর্ণ নতুন টেস্ট
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDestMode("append")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        destMode === "append"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <div className="font-bold">বিদ্যমান পরীক্ষায় যোগ করুন</div>
                      <div className="text-[10px] text-slate-400">
                        আগে থেকে তৈরি কোনো পরীক্ষায় অ্যাপেন্ড
                      </div>
                    </button>
                  </div>

                  {destMode === "new_exam" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          পরীক্ষার নাম
                        </label>
                        <input
                          type="text"
                          value={newExamName}
                          onChange={(e) => setNewExamName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          কোর্স ও বিষয়
                        </label>
                        <select
                          value={newExamCourseId}
                          onChange={(e) => setNewExamCourseId(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                        >
                          {courses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {destMode === "append" && (
                    <div className="pt-2">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        টার্গেট পরীক্ষা নির্বাচন করুন
                      </label>
                      <select
                        value={targetExamId}
                        onChange={(e) => setTargetExamId(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                      >
                        {exams.map((ex) => (
                          <option key={ex.id} value={ex.id}>
                            {ex.name} ({toBanglaNum(ex.questions.length)}টি প্রশ্ন)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Question List Preview */}
                <div className="space-y-3">
                  {draftQuestions.map((q, idx) => {
                    const isSelected = selectedIds.has(q.id);
                    const isExpanded = previewExpanded[q.id];

                    return (
                      <div
                        key={q.id}
                        className={`rounded-2xl border p-4 transition-all ${
                          isSelected
                            ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                            : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 opacity-60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => {
                                const next = new Set(selectedIds);
                                if (next.has(q.id)) next.delete(q.id);
                                else next.add(q.id);
                                setSelectedIds(next);
                              }}
                              className="mt-1 text-blue-600"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                <span className="font-mono text-blue-600 mr-1.5">
                                  {toBanglaNum(idx + 1)}.
                                </span>
                                <MathText text={q.text} />
                              </div>

                              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                                <span>সঠিক উত্তর: {getOptionLetter(q.answer)}</span>
                                <span>•</span>
                                <span>{q.options.length}টি অপশন</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewExpanded((prev) => ({
                                  ...prev,
                                  [q.id]: !prev[q.id]
                                }))
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                              title={isExpanded ? "সংক্ষেপ করুন" : "বিস্তারিত এডিট করুন"}
                            >
                              {isExpanded ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDraftQuestions((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                );
                                const next = new Set(selectedIds);
                                next.delete(q.id);
                                setSelectedIds(next);
                              }}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-600"
                              title="প্রশ্ন মুছুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Expanded Question Editor */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                  প্রশ্ন বিবরণ
                                </label>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormulaTarget({
                                      qIdx: idx,
                                      field: "text",
                                      label: `প্রশ্ন #${idx + 1}`
                                    })
                                  }
                                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold"
                                >
                                  <Sigma className="w-3 h-3" />
                                  <span>ফর্মুলা যুক্ত করুন</span>
                                </button>
                              </div>
                              <input
                                type="text"
                                value={q.text}
                                onChange={(e) => updateDraft(idx, { text: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="space-y-1">
                                  <div className="flex items-center justify-between text-[11px]">
                                    <label className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-400">
                                      <input
                                        type="radio"
                                        name={`ans_${q.id}`}
                                        checked={q.answer === oIdx}
                                        onChange={() => updateDraft(idx, { answer: oIdx })}
                                        className="text-emerald-600"
                                      />
                                      <span>অপশন {getOptionLetter(oIdx)}</span>
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setFormulaTarget({
                                          qIdx: idx,
                                          field: "option",
                                          optIdx: oIdx,
                                          label: `প্রশ্ন #${idx + 1} অপশন ${getOptionLetter(
                                            oIdx
                                          )}`
                                        })
                                      }
                                      className="text-blue-500 hover:text-blue-700 text-[10px]"
                                    >
                                      Σ
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                      const next = [...q.options];
                                      next[oIdx] = e.target.value;
                                      updateDraft(idx, { options: next });
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                                  />
                                </div>
                              ))}
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                  ব্যাখ্যা
                                </label>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormulaTarget({
                                      qIdx: idx,
                                      field: "explanation",
                                      label: `প্রশ্ন #${idx + 1} ব্যাখ্যা`
                                    })
                                  }
                                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold"
                                >
                                  <Sigma className="w-3 h-3" />
                                  <span>ফর্মুলা</span>
                                </button>
                              </div>
                              <input
                                type="text"
                                value={q.explanation}
                                onChange={(e) =>
                                  updateDraft(idx, { explanation: e.target.value })
                                }
                                placeholder="ব্যাখ্যা লিখুন..."
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-[#182234]/70 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              বাতিল
            </button>

            {parseResult && (
              <button
                type="button"
                disabled={selectedQuestions.length === 0}
                onClick={handleConfirmImport}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-45 text-white text-xs font-semibold transition-colors"
              >
                প্রিভিউ নিশ্চিত করে সংরক্ষণ করুন ({toBanglaNum(selectedQuestions.length)}টি প্রশ্ন)
              </button>
            )}
          </div>
        </div>
      </div>

      <FormulaEditorModal
        open={Boolean(formulaTarget)}
        targetLabel={formulaTarget?.label}
        onInsert={handleFormulaInsert}
        onClose={() => setFormulaTarget(null)}
      />
    </>
  );
};
