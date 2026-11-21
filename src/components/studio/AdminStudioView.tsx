"use client";

import React, { useState } from "react";
import {
  Wrench,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Upload,
  Download,
  Megaphone,
  Clock,
  ArrowUp,
  ArrowDown,
  Sigma,
  Save,
  ImageIcon
} from "lucide-react";
import { Exam, Course, Question, Notice, Maintenance } from "@/types";
import { usePortal } from "@/context/PortalContext";
import { MathText } from "@/components/math/MathText";
import { FormulaEditorModal } from "@/components/math/FormulaEditorModal";
import { BulkImportModal } from "./BulkImportModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import {
  toBanglaNum,
  getOptionLetter,
  getExamTotalMarks,
  downloadJson,
  resizeQuestionImage
} from "@/utils/format";
import { enrichQuestionFormulas } from "@/utils/math";

export interface AdminStudioViewProps {
  courses?: Course[];
  exams?: Exam[];
  notice?: Notice;
  maintenance?: Maintenance;
}

const createEmptyQuestion = (subject?: string, chapter?: string): Question => ({
  id: "q_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
  text: "",
  questionType: "mcq",
  options: ["", "", "", ""],
  answer: 0,
  explanation: "",
  subject: subject || "পদার্থবিজ্ঞান",
  chapter: chapter || "সাধারণ",
  difficulty: "medium",
  marks: 1
});

export const AdminStudioView: React.FC<AdminStudioViewProps> = ({
  courses: propCourses,
  exams: propExams,
  notice: propNotice,
  maintenance: propMaintenance
}) => {
  const portal = usePortal();
  const courses = propCourses || portal.courses;
  const exams = propExams || portal.exams;
  const notice = propNotice || portal.notice;
  const maintenance = propMaintenance || portal.maintenance;

  const [activeTab, setActiveTab] = useState<
    "exams" | "editor" | "system" | "backup"
  >("exams");

  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [activeQIndex, setActiveQIndex] = useState(0);

  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [formulaTarget, setFormulaTarget] = useState<{
    qIdx: number;
    field: "text" | "explanation" | "option";
    optIdx?: number;
    label: string;
  } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [noticeTitle, setNoticeTitle] = useState(notice.title);
  const [noticeMessage, setNoticeMessage] = useState(notice.message);
  const [maintEnabled, setMaintEnabled] = useState(maintenance.enabled);
  const [maintMessage, setMaintMessage] = useState(maintenance.message);
  const [maintExpected, setMaintExpected] = useState(maintenance.expectedTime);

  const startCreateExam = () => {
    const course = courses[0];
    const newEx: Exam = {
      id: "exam_" + Date.now(),
      name: "নতুন মডেল টেস্ট",
      courseId: course?.id || "frpb",
      subject: course?.subjects[0]?.name || "পদার্থবিজ্ঞান",
      chapter: course?.subjects[0]?.chapters[0] || "১ম অধ্যায়",
      type: "Model Test",
      minutes: 15,
      marks: 1,
      negative: 0.25,
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 16),
      retakeAllowed: true,
      published: true,
      instructions: [
        "পরীক্ষার মোট সময় ১৫ মিনিট।",
        "প্রতিটি সঠিক উত্তরের জন্য ১ নম্বর, ভুল উত্তরের জন্য ০.২৫ নম্বর কাটা যাবে।"
      ],
      questions: [createEmptyQuestion()]
    };
    setEditingExam(newEx);
    setActiveQIndex(0);
    setActiveTab("editor");
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExam({
      ...exam,
      questions: exam.questions.map((q) => ({ ...q, options: [...q.options] }))
    });
    setActiveQIndex(0);
    setActiveTab("editor");
  };

  const handleSaveExam = () => {
    if (!editingExam) return;
    if (!editingExam.name.trim()) {
      portal.showToast("অনুগ্রহ করে পরীক্ষার নাম লিখুন।");
      return;
    }
    if (editingExam.questions.length === 0) {
      portal.showToast("কমপক্ষে ১টি প্রশ্ন যোগ করুন।");
      return;
    }

    portal.saveExam(editingExam);
    portal.showToast("পরীক্ষা সফলভাবে সংরক্ষিত হয়েছে!");
    setActiveTab("exams");
  };

  const updateQuestion = (idx: number, patch: Partial<Question>) => {
    if (!editingExam) return;
    const questions = [...editingExam.questions];
    questions[idx] = enrichQuestionFormulas({
      ...questions[idx],
      ...patch
    });
    setEditingExam({ ...editingExam, questions });
  };

  const handleAddQuestion = () => {
    if (!editingExam) return;
    const newQ = createEmptyQuestion(editingExam.subject, editingExam.chapter);
    const questions = [...editingExam.questions, newQ];
    setEditingExam({ ...editingExam, questions });
    setActiveQIndex(questions.length - 1);
  };

  const handleDuplicateQuestion = (idx: number) => {
    if (!editingExam) return;
    const target = editingExam.questions[idx];
    const dupe: Question = {
      ...target,
      id: "q_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      options: [...target.options]
    };
    const questions = [
      ...editingExam.questions.slice(0, idx + 1),
      dupe,
      ...editingExam.questions.slice(idx + 1)
    ];
    setEditingExam({ ...editingExam, questions });
    setActiveQIndex(idx + 1);
  };

  const handleDeleteQuestion = (idx: number) => {
    if (!editingExam || editingExam.questions.length <= 1) {
      portal.showToast("পরীক্ষায় কমপক্ষে ১টি প্রশ্ন থাকতে হবে।");
      return;
    }
    const questions = editingExam.questions.filter((_, i) => i !== idx);
    setEditingExam({ ...editingExam, questions });
    setActiveQIndex(Math.max(0, Math.min(idx, questions.length - 1)));
  };

  const handleMoveQuestion = (idx: number, direction: "up" | "down") => {
    if (!editingExam) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= editingExam.questions.length) return;
    const questions = [...editingExam.questions];
    const temp = questions[idx];
    questions[idx] = questions[targetIdx];
    questions[targetIdx] = temp;
    setEditingExam({ ...editingExam, questions });
    setActiveQIndex(targetIdx);
  };

  const handleFormulaInsert = (formatted: string) => {
    if (!formulaTarget || !editingExam) return;
    const q = editingExam.questions[formulaTarget.qIdx];
    if (!q) return;

    if (formulaTarget.field === "text") {
      updateQuestion(formulaTarget.qIdx, {
        text: q.text ? `${q.text} ${formatted}` : formatted
      });
    } else if (formulaTarget.field === "explanation") {
      updateQuestion(formulaTarget.qIdx, {
        explanation: q.explanation ? `${q.explanation} ${formatted}` : formatted
      });
    } else if (formulaTarget.field === "option" && formulaTarget.optIdx !== undefined) {
      const nextOpts = [...q.options];
      const cur = nextOpts[formulaTarget.optIdx] || "";
      nextOpts[formulaTarget.optIdx] = cur ? `${cur} ${formatted}` : formatted;
      updateQuestion(formulaTarget.qIdx, { options: nextOpts });
    }
  };

  const handleQuestionImageUpload = async (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUri = await resizeQuestionImage(file, 960, 720);
      const q = editingExam?.questions[idx];
      if (q) {
        const curImages = q.questionImages || [];
        updateQuestion(idx, { questionImages: [...curImages, dataUri] });
        portal.showToast("প্রশ্নের চিত্র সফলভাবে যুক্ত হয়েছে!");
      }
    } catch {
      portal.showToast("চিত্র আপলোড ব্যর্থ হয়েছে।");
    } finally {
      e.target.value = "";
    }
  };

  const currentQ = editingExam?.questions[activeQIndex];

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            কনটেন্ট ও প্রশ্ন ব্যবস্থাপনা
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Wrench className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>ইনস্ট্রাক্টর ও অ্যাডমিন স্টুডিও</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            মডেল টেস্ট প্রণয়ন, LaTeX ফর্মুলা এডিটর, বাল্ক ফাইল ইমপোর্ট ও সিস্টেম নিয়ন্ত্রণ।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={startCreateExam}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন পরীক্ষা তৈরি</span>
          </button>
          <button
            type="button"
            onClick={() => setBulkImportOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#182234] text-xs sm:text-sm font-semibold transition-colors border border-slate-200 dark:border-slate-700 whitespace-nowrap"
          >
            <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>বাল্ক ইমপোর্ট</span>
          </button>
        </div>
      </div>

      {/* Responsive Segmented Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 w-full sm:w-fit text-xs font-semibold overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("exams")}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === "exams"
              ? "bg-white dark:bg-[#182234] text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          সকল পরীক্ষা ({toBanglaNum(exams.length)})
        </button>
        {editingExam && (
          <button
            type="button"
            onClick={() => setActiveTab("editor")}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === "editor"
                ? "bg-white dark:bg-[#182234] text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            এডিটর: {editingExam.name.slice(0, 16)}
            {editingExam.name.length > 16 ? "…" : ""}
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveTab("system")}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === "system"
              ? "bg-white dark:bg-[#182234] text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          নোটিশ ও সিস্টেম
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("backup")}
          className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === "backup"
              ? "bg-white dark:bg-[#182234] text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          ব্যাকআপ ও এক্সপোর্ট
        </button>
      </div>

      {/* Tab 1: Exam List */}
      {activeTab === "exams" && (
        <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-[#182234]/70">
                  <th className="py-3.5 px-5">পরীক্ষার নাম</th>
                  <th className="py-3.5 px-4">বিষয় ও অধ্যায়</th>
                  <th className="py-3.5 px-4 text-right">প্রশ্ন</th>
                  <th className="py-3.5 px-4 text-right">সময় / পূর্ণমান</th>
                  <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                  <th className="py-3.5 px-5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {exams.map((ex) => (
                  <tr
                    key={ex.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-[#182234]/60 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {ex.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                        {ex.id} · {ex.type}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      <div className="font-medium">{ex.subject}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {ex.chapter}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {toBanglaNum(ex.questions.length)}টি
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <div>{toBanglaNum(ex.minutes)} মিনিট</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {toBanglaNum(getExamTotalMarks(ex))} নম্বর
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          ex.published
                            ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                            : "bg-slate-100 dark:bg-[#182234] text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {ex.published ? "প্রকাশিত" : "ড্রাফট"}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditExam(ex)}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/15 transition-colors"
                          title="পরীক্ষা সম্পাদনা করুন"
                          aria-label="পরীক্ষা সম্পাদনা করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const dupe = {
                              ...ex,
                              id: "exam_" + Date.now(),
                              name: ex.name + " (কপি)",
                              published: false
                            };
                            portal.saveExam(dupe);
                          }}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#182234] transition-colors"
                          title="ডুপ্লিকেট করুন"
                          aria-label="ডুপ্লিকেট করুন"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(ex.id)}
                          className="p-2 rounded-lg border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/15 transition-colors"
                          title="মুছে ফেলুন"
                          aria-label="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Full Exam & Question Editor */}
      {activeTab === "editor" && editingExam && (
        <div className="space-y-6">
          {/* Exam Metadata Card */}
          <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>পরীক্ষার মূল বিবরণ ও নিয়মাবলী</span>
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBulkImportOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-[#182234]"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>বাল্ক প্রশ্ন যুক্ত</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveExam}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>পরীক্ষা সংরক্ষণ করুন</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  পরীক্ষার নাম
                </label>
                <input
                  type="text"
                  value={editingExam.name}
                  onChange={(e) =>
                    setEditingExam({ ...editingExam, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182234] text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  কোর্স / ব্যাচ
                </label>
                <select
                  value={editingExam.courseId}
                  onChange={(e) =>
                    setEditingExam({ ...editingExam, courseId: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182234] text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  বিষয়
                </label>
                <input
                  type="text"
                  value={editingExam.subject}
                  onChange={(e) =>
                    setEditingExam({ ...editingExam, subject: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182234] text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  অধ্যায়
                </label>
                <input
                  type="text"
                  value={editingExam.chapter}
                  onChange={(e) =>
                    setEditingExam({ ...editingExam, chapter: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182234] text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  সময় (মিনিট)
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingExam.minutes}
                  onChange={(e) =>
                    setEditingExam({
                      ...editingExam,
                      minutes: Math.max(1, Number(e.target.value))
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182234] text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  নেগেটিভ মার্ক
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={editingExam.negative}
                  onChange={(e) =>
                    setEditingExam({
                      ...editingExam,
                      negative: Math.max(0, Number(e.target.value))
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182234] text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-5 sm:col-span-2 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingExam.published}
                    onChange={(e) =>
                      setEditingExam({ ...editingExam, published: e.target.checked })
                    }
                    className="rounded text-blue-600"
                  />
                  <span>শিক্ষার্থীদের জন্য প্রকাশ করুন (Published)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingExam.retakeAllowed}
                    onChange={(e) =>
                      setEditingExam({ ...editingExam, retakeAllowed: e.target.checked })
                    }
                    className="rounded text-blue-600"
                  />
                  <span>পুনরায় পরীক্ষা দেওয়ার অনুমতি (Retake)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Question Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-[296px_1fr] gap-6 items-start">
            {/* Question Selector List */}
            <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  প্রশ্ন তালিকা ({toBanglaNum(editingExam.questions.length)})
                </span>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/25 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>প্রশ্ন যোগ</span>
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto space-y-1.5 pr-0.5">
                {editingExam.questions.map((q, idx) => {
                  const isCurrent = idx === activeQIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-2.5 rounded-xl border text-xs transition-colors flex items-center justify-between gap-2 ${
                        isCurrent
                          ? "border-blue-500 bg-blue-50/70 dark:bg-blue-500/15"
                          : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveQIndex(idx)}
                        className="flex-1 min-w-0 text-left font-semibold text-slate-900 dark:text-slate-100 truncate"
                      >
                        {toBanglaNum(idx + 1)}.{" "}
                        {q.text ? q.text.slice(0, 28) : "খালি প্রশ্ন"}
                      </button>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveQuestion(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-25"
                          aria-label="উপরে সরান"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveQuestion(idx, "down")}
                          disabled={idx === editingExam.questions.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-25"
                          aria-label="নিচে সরান"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(idx)}
                          className="p-1 rounded text-rose-400 hover:text-rose-600"
                          aria-label="প্রশ্ন মুছুন"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Question Editor Form */}
            {currentQ && (
              <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-mono text-xs flex items-center justify-center font-bold">
                      {toBanglaNum(activeQIndex + 1)}
                    </span>
                    <span>প্রশ্ন সম্পাদনা</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDuplicateQuestion(activeQIndex)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#182234]"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>ডুপ্লিকেট</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(activeQIndex)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-500/30 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/15"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      প্রশ্নের মূল বক্তব্য (Stem)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormulaTarget({
                          qIdx: activeQIndex,
                          field: "text",
                          label: `প্রশ্ন #${activeQIndex + 1}`
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                      <Sigma className="w-3.5 h-3.5" />
                      <span>ফর্মুলা যুক্ত করুন</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={currentQ.text}
                    onChange={(e) => updateQuestion(activeQIndex, { text: e.target.value })}
                    placeholder="এখানে প্রশ্ন টাইপ করুন... যেমন: একটি বস্তুর ভর $m = 5\text{ kg}$..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182234] text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                  />
                  {currentQ.text && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#182234] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold block text-[11px] text-slate-400 mb-1">
                        লাইভ প্রিভিউ
                      </span>
                      <MathText text={currentQ.text} />
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>উত্তর অপশনসমূহ (সঠিক উত্তরে রেডিও সিলেক্ট করুন)</span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...currentQ.options, ""];
                        updateQuestion(activeQIndex, { options: next });
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                    >
                      + নতুন অপশন
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQ.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-xl border transition-colors ${
                          currentQ.answer === oIdx
                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10"
                            : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#182234]/50"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-2">
                          <label className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                            <input
                              type="radio"
                              name={`admin_ans_${currentQ.id}`}
                              checked={currentQ.answer === oIdx}
                              onChange={() => updateQuestion(activeQIndex, { answer: oIdx })}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>অপশন {getOptionLetter(oIdx)}</span>
                          </label>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setFormulaTarget({
                                  qIdx: activeQIndex,
                                  field: "option",
                                  optIdx: oIdx,
                                  label: `প্রশ্ন #${activeQIndex + 1} অপশন ${getOptionLetter(
                                    oIdx
                                  )}`
                                })
                              }
                              className="p-1 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/15 text-xs font-mono"
                              title="ফর্মুলা যুক্ত করুন"
                            >
                              Σ
                            </button>
                            {currentQ.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const next = currentQ.options.filter((_, i) => i !== oIdx);
                                  const nextAns =
                                    currentQ.answer >= next.length ? 0 : currentQ.answer;
                                  updateQuestion(activeQIndex, {
                                    options: next,
                                    answer: nextAns
                                  });
                                }}
                                className="p-1 rounded text-rose-400 hover:text-rose-600"
                                title="অপশন মুছুন"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const next = [...currentQ.options];
                            next[oIdx] = e.target.value;
                            updateQuestion(activeQIndex, { options: next });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      সঠিক উত্তরের ব্যাখ্যা ও সমাধান
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormulaTarget({
                          qIdx: activeQIndex,
                          field: "explanation",
                          label: `প্রশ্ন #${activeQIndex + 1} ব্যাখ্যা`
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                      <Sigma className="w-3.5 h-3.5" />
                      <span>ফর্মুলা</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={currentQ.explanation}
                    onChange={(e) =>
                      updateQuestion(activeQIndex, { explanation: e.target.value })
                    }
                    placeholder="ব্যাখ্যা লিখুন..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182234] text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                {/* Question Image Attachment */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      প্রশ্নের চিত্র / ডায়াগ্রাম
                    </span>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#182234] text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>চিত্র আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleQuestionImageUpload(activeQIndex, e)}
                      />
                    </label>
                  </div>
                  {currentQ.questionImages && currentQ.questionImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {currentQ.questionImages.map((img, i) => (
                        <div
                          key={i}
                          className="relative group w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                        >
                          <img src={img} alt="Q" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const next = currentQ.questionImages?.filter((_, idx) => idx !== i);
                              updateQuestion(activeQIndex, { questionImages: next });
                            }}
                            className="absolute inset-0 bg-rose-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="চিত্র মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: System Notice & Maintenance */}
      {activeTab === "system" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>সিস্টেম নোটিশ ও ঘোষণা ব্যানার</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              এই নোটিশটি ওয়েবসাইটের একেবারে উপরে সকল শিক্ষার্থীর নিকট প্রদর্শিত হবে।
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  নোটিশের শিরোনাম
                </label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182234] text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  বার্তা
                </label>
                <textarea
                  rows={3}
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182234] text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    portal.updateNotice({
                      title: noticeTitle.trim(),
                      message: noticeMessage.trim(),
                      updatedAt: new Date().toISOString()
                    })
                  }
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                >
                  নোটিশ হালনাগাদ করুন
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>মেইনটেন্যান্স মোড সেটিংস</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              জরুরি সার্ভার আপগ্রেডের সময় এটি সক্রিয় করলে সাধারণ শিক্ষার্থীরা অপেক্ষা বার্তা দেখবে।
            </p>

            <div className="space-y-4 pt-1">
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#182234] border border-slate-200/80 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintEnabled}
                  onChange={(e) => setMaintEnabled(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  মেইনটেন্যান্স মোড সক্রিয় করুন
                </span>
              </label>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  আনুমানিক প্রত্যাশিত সময়
                </label>
                <input
                  type="text"
                  value={maintExpected}
                  onChange={(e) => setMaintExpected(e.target.value)}
                  placeholder="যেমন: ৩০ মিনিট পর"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182234] text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  মেইনটেন্যান্স বার্তা
                </label>
                <textarea
                  rows={2}
                  value={maintMessage}
                  onChange={(e) => setMaintMessage(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182234] text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    portal.updateMaintenance({
                      enabled: maintEnabled,
                      message: maintMessage.trim(),
                      expectedTime: maintExpected.trim(),
                      enabledAt: new Date().toISOString()
                    })
                  }
                  className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
                >
                  মেইনটেন্যান্স সেটিংস সংরক্ষণ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Backup & Restore */}
      {activeTab === "backup" && (
        <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 space-y-5 max-w-2xl">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>সিস্টেম ডেটা এক্সপোর্ট ও ব্যাকআপ</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            পোর্টালের সকল কোর্স, প্রশ্নপত্র এবং মডেল টেস্ট নিরাপদ ব্যাকআপ হিসেবে JSON ফাইল আকারে ডাউনলোড করুন।
          </p>

          <div>
            <button
              type="button"
              onClick={() =>
                downloadJson(
                  `learning-generation-exams-backup-${Date.now()}.json`,
                  { courses, exams, notice, exportedAt: new Date().toISOString() }
                )
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>সম্পূর্ণ ডেটা JSON ডাউনলোড করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <BulkImportModal
        open={bulkImportOpen}
        courses={courses}
        exams={exams}
        activeEditingExam={editingExam}
        onImportIntoEditingExam={(questions) => {
          if (editingExam) {
            setEditingExam({
              ...editingExam,
              questions: [...editingExam.questions, ...questions]
            });
            portal.showToast(`${questions.length}টি প্রশ্ন এডিটিং পরীক্ষায় যুক্ত হয়েছে!`);
          }
        }}
        onAppendToExistingExam={(examId, questions) => {
          const ex = exams.find((e) => e.id === examId);
          if (ex) {
            portal.saveExam({
              ...ex,
              questions: [...ex.questions, ...questions]
            });
          }
        }}
        onCreateNewExamWithQuestions={(newEx) => {
          portal.saveExam(newEx);
        }}
        onClose={() => setBulkImportOpen(false)}
      />

      <FormulaEditorModal
        open={Boolean(formulaTarget)}
        targetLabel={formulaTarget?.label}
        onInsert={handleFormulaInsert}
        onClose={() => setFormulaTarget(null)}
      />

      <ConfirmModal
        open={Boolean(deleteConfirmId)}
        title="পরীক্ষাটি মুছে ফেলতে চান?"
        description="এই পরীক্ষা এবং এর সাথে সম্পর্কিত সকল প্রশ্ন ডাটাবেজ থেকে মুছে যাবে।"
        confirmLabel="হ্যাঁ, মুছে ফেলুন"
        tone="danger"
        onConfirm={() => {
          if (deleteConfirmId) {
            portal.deleteExam(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
