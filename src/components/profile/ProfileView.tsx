"use client";

import React, { useState, useRef } from "react";
import {
  User as UserIcon,
  Image as ImageIcon,
  Camera,
  Trash2,
  Volume2,
  VolumeX,
  RotateCcw,
  Target,
  ShieldCheck,
  GraduationCap,
  LogOut
} from "lucide-react";
import { User, Course, ExamResult } from "@/types";
import { usePortal } from "@/context/PortalContext";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { resizeProfileImage, toBanglaNum } from "@/utils/format";

export interface ProfileViewProps {
  user?: User;
  courses?: Course[];
  history?: ExamResult[];
  streakCount?: number;
  darkMode?: boolean;
  soundEnabled?: boolean;
  onUpdateProfile?: (data: Partial<User>) => void;
  onToggleTheme?: () => void;
  onToggleSound?: () => void;
  onResetAllData?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user: propUser,
  courses: propCourses,
  history: propHistory,
  soundEnabled: propSoundEnabled,
  onUpdateProfile: propUpdateProfile,
  onToggleSound: propToggleSound,
  onResetAllData: propResetAllData
}) => {
  const portal = usePortal();
  const user = propUser || portal.activeUser;
  const courses = propCourses || portal.courses;
  const history = propHistory || portal.history;
  const soundEnabled = propSoundEnabled ?? portal.soundEnabled;
  const onUpdateProfile = propUpdateProfile || portal.updateProfile;
  const onToggleSound = propToggleSound || portal.toggleSound;
  const onResetAllData = propResetAllData || portal.resetAllData;

  const [name, setName] = useState(user.name);
  const [targetBatch, setTargetBatch] = useState(
    user.targetBatch || courses[0]?.name || ""
  );
  const [dailyGoal, setDailyGoal] = useState(user.dailyGoalExams || 2);
  const [showResetModal, setShowResetModal] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const avgAccuracy =
    history.length > 0
      ? Math.round(
          history.reduce((s, r) => s + r.accuracy, 0) / history.length
        )
      : 0;
  const bestAccuracy =
    history.length > 0 ? Math.max(...history.map((r) => r.accuracy)) : 0;

  const todayISO = new Date().toISOString().slice(0, 10);
  const examsToday = history.filter(
    (h) => h.dateISO.slice(0, 10) === todayISO
  ).length;
  const goalPct = Math.min(
    100,
    Math.round((examsToday / Math.max(1, dailyGoal)) * 100)
  );

  const handlePhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      portal.showToast("অনুগ্রহ করে একটি বৈধ ছবি নির্বাচন করুন।");
      return;
    }
    try {
      const resized = await resizeProfileImage(file, 360);
      onUpdateProfile({ photo: resized });
      portal.showToast("প্রোফাইল ছবি আপডেট হয়েছে।");
    } catch {
      portal.showToast("ছবি আপলোড করতে সমস্যা হয়েছে।");
    } finally {
      e.target.value = "";
    }
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      portal.showToast("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
      return;
    }
    onUpdateProfile({
      name: name.trim(),
      targetBatch,
      dailyGoalExams: Math.max(1, Math.min(10, dailyGoal))
    });
  };

  return (
    <div className="space-y-7">
      <div className="flex items-start gap-3.5">
        <span className="w-10 h-10 rounded-xl bg-blue-500/12 border border-blue-500/25 flex items-center justify-center shrink-0 mt-0.5">
          <UserIcon className="w-5 h-5 text-blue-400" />
        </span>
        <div>
          <p className="text-xs font-semibold text-blue-400">অ্যাকাউন্ট</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 leading-tight">
            প্রোফাইল ও সেটিংস
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            ব্যক্তিগত তথ্য, দৈনিক অনুশীলন লক্ষ্য এবং অ্যাকাউন্ট পছন্দসমূহ পরিচালনা করুন।
          </p>
        </div>
      </div>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handlePhotoFile}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoFile}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Left Column */}
        <div className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] p-6 space-y-5">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold border border-white/[0.15] shadow-lg shadow-blue-600/20">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-50">
              {user.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-blue-400">
              {user.role === "admin" ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5" />
              )}
              <span>
                {user.role === "admin"
                  ? "ইনস্ট্রাক্টর / অ্যাডমিন"
                  : "শিক্ষার্থী অ্যাকাউন্ট"}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.1] bg-[#131824] text-xs font-semibold text-slate-200 hover:bg-[#181F2E] transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>ছবি আপলোড</span>
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.1] bg-[#131824] text-xs font-semibold text-slate-200 hover:bg-[#181F2E] transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>ক্যামেরা</span>
              </button>
              {user.photo && (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateProfile({ photo: null });
                    portal.showToast("ছবি মুছে ফেলা হয়েছে।");
                  }}
                  className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="ছবি মুছুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.07] grid grid-cols-2 divide-x divide-white/[0.07] text-center">
            <div className="px-2">
              <span className="text-[11px] text-slate-400 block">
                গড় সঠিকতা
              </span>
              <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums mt-0.5 block">
                {toBanglaNum(avgAccuracy)}%
              </span>
            </div>
            <div className="px-2">
              <span className="text-[11px] text-slate-400 block">
                সর্বোচ্চ স্কোর
              </span>
              <span className="text-lg font-bold font-mono text-blue-400 tabular-nums mt-0.5 block">
                {toBanglaNum(bestAccuracy)}%
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#111622] border border-white/[0.07] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-blue-400" />
                <span>আজকের স্টাডি গোল</span>
              </span>
              <span className="font-mono tabular-nums text-blue-400">
                {toBanglaNum(examsToday)}/{toBanglaNum(dailyGoal)} পরীক্ষা
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.07] overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${goalPct}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={portal.openAuthModal}
            className="w-full py-2.5 px-4 rounded-xl border border-white/[0.1] bg-[#131824] hover:bg-[#181F2E] text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>অন্য অ্যাকাউন্টে পরিবর্তন</span>
          </button>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <form
            onSubmit={handleSaveDetails}
            className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] p-6 sm:p-7 space-y-5"
          >
            <h3 className="text-base font-bold text-slate-50 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-400" />
              <span>ব্যক্তিগত তথ্য ও লক্ষ্য নির্ধারণ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  পূর্ণ নাম
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.1] bg-[#131824] text-sm text-slate-100 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  টার্গেট ব্যাচ / কোর্স
                </label>
                <select
                  value={targetBatch}
                  onChange={(e) => setTargetBatch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.1] bg-[#131824] text-sm text-slate-100 focus:border-blue-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                দৈনিক লক্ষ্য (প্রতিদিন কতটি পরীক্ষা দেবেন?)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="flex-1 accent-blue-500"
                />
                <span className="w-16 text-right font-mono font-bold text-sm text-blue-400 tabular-nums">
                  {toBanglaNum(dailyGoal)}টি
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
              >
                পরিবর্তন সংরক্ষণ করুন
              </button>
            </div>
          </form>

          {/* Preferences & Reset */}
          <div className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] p-6 sm:p-7 space-y-5">
            <h3 className="text-base font-bold text-slate-50">
              অ্যাপ সেটিংস ও পোর্টাল নিয়ন্ত্রণ
            </h3>

            <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-[#111622] border border-white/[0.07]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-[#0C0F16] border border-white/[0.08] text-slate-300 shrink-0">
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-100">
                    সাউন্ড ইফেক্ট
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {soundEnabled
                      ? "উত্তর নির্বাচন ও ফলাফল শব্দ সক্রিয়"
                      : "সব সাউন্ড ইফেক্ট মিউট করা আছে"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleSound}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-white/[0.1] bg-[#131824] text-slate-200 hover:bg-[#181F2E] shrink-0 transition-colors"
              >
                {soundEnabled ? "বন্ধ করুন" : "চালু করুন"}
              </button>
            </div>

            <div className="pt-4 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-rose-400">
                  পোর্টাল ডেটা রিসেট
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  স্থানীয়ভাবে সংরক্ষিত সকল পরীক্ষা ও ইতিহাস ডিফল্ট ডেটায় ফিরিয়ে আনুন।
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-colors border border-rose-500/30"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>সব ডেটা রিসেট করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showResetModal}
        title="সকল ডেটা রিসেট করবেন?"
        description="আপনার নেওয়া সকল পরীক্ষার ইতিহাস ও সম্পাদিত প্রশ্ন মুছে ডিফল্ট সিড ডেটায় ফিরে যাবে। এই কাজ বাতিল করা যাবে না।"
        confirmLabel="হ্যাঁ, সব রিসেট করুন"
        tone="danger"
        onConfirm={() => {
          setShowResetModal(false);
          onResetAllData();
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
};
