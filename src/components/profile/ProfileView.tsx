"use client";

import React, { useState, useRef } from "react";
import {
  User as UserIcon,
  Image as ImageIcon,
  Camera,
  Trash2,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Target,
  CheckCircle2,
  Flame,
  Award,
  BookOpen,
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
  streakCount: propStreakCount,
  darkMode: propDarkMode,
  soundEnabled: propSoundEnabled,
  onUpdateProfile: propUpdateProfile,
  onToggleTheme: propToggleTheme,
  onToggleSound: propToggleSound,
  onResetAllData: propResetAllData
}) => {
  const portal = usePortal();
  const user = propUser || portal.activeUser;
  const courses = propCourses || portal.courses;
  const history = propHistory || portal.history;
  const streakCount = propStreakCount ?? portal.streak.count;
  const darkMode = propDarkMode ?? portal.darkMode;
  const soundEnabled = propSoundEnabled ?? portal.soundEnabled;
  const onUpdateProfile = propUpdateProfile || portal.updateProfile;
  const onToggleTheme = propToggleTheme || portal.toggleDarkMode;
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
      ? Math.round(history.reduce((s, r) => s + r.accuracy, 0) / history.length)
      : 0;
  const bestAccuracy =
    history.length > 0 ? Math.max(...history.map((r) => r.accuracy)) : 0;

  const todayISO = new Date().toISOString().slice(0, 10);
  const examsToday = history.filter((h) => h.dateISO.slice(0, 10) === todayISO).length;
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
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          প্রোফাইল ও সেটিংস
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          ব্যক্তিগত তথ্য, দৈনিক লক্ষ্য, ডার্ক মোড ও অ্যাকাউন্ট পরিচালনা করুন।
        </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
        {/* Left Column: Avatar & Quick Info */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-xs">
          <div className="flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center text-3xl font-extrabold border-4 border-slate-100 dark:border-slate-800 shadow-md">
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
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              {user.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {user.role === "admin" ? "ইনস্ট্রাক্টর / অ্যাডমিন" : "প্রিমিয়াম শিক্ষার্থী"}
              </span>
            </div>

            {/* Photo Action Buttons */}
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>ছবি আপলোড</span>
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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
                  className="p-1.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors"
                  title="ছবি মুছুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[10px] text-slate-400 block font-medium">গড় সঠিকতা</span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {toBanglaNum(avgAccuracy)}%
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[10px] text-slate-400 block font-medium">সর্বোচ্চ স্কোর</span>
              <span className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                {toBanglaNum(bestAccuracy)}%
              </span>
            </div>
          </div>

          {/* Today's Daily Goal Progress */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-900 dark:text-blue-200">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>আজকের স্টাডি গোল</span>
              </span>
              <span>
                {toBanglaNum(examsToday)}/{toBanglaNum(dailyGoal)} পরীক্ষা
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-blue-200 dark:bg-blue-900 overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300"
                style={{ width: `${goalPct}%` }}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={portal.openAuthModal}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>অন্য অ্যাকাউন্টে পরিবর্তন / সুইচ</span>
            </button>
          </div>
        </div>

        {/* Right Column: Settings & Goals Form */}
        <div className="space-y-6">
          <form
            onSubmit={handleSaveDetails}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-xs"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-600" />
              <span>ব্যক্তিগত তথ্য ও লক্ষ্য নির্ধারণ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  পূর্ণ নাম
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  টার্গেট ব্যাচ / কোর্স
                </label>
                <select
                  value={targetBatch}
                  onChange={(e) => setTargetBatch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
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
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                দৈনিক লক্ষ্য (প্রতিদিন কতটি পরীক্ষা দেবেন?)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="flex-1 accent-blue-600"
                />
                <span className="w-16 text-center font-mono font-bold text-sm text-blue-600 dark:text-blue-400 tabular-nums">
                  {toBanglaNum(dailyGoal)}টি
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>

          {/* Preferences & Reset */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              অ্যাপ সেটিংস ও পোর্টাল নিয়ন্ত্রণ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      ডার্ক মোড
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {darkMode ? "ডার্ক থিম চালু" : "লাইট থিম চালু"}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900"
                >
                  সুইচ
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      সাউন্ড ইফেক্ট
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {soundEnabled ? "শব্দ সক্রিয়" : "শব্দ মিউট"}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onToggleSound}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900"
                >
                  সুইচ
                </button>
              </div>
            </div>

            {/* Reset Data Danger Zone */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-red-600 dark:text-red-400">
                  পোর্টাল ডেটা রিসেট
                </div>
                <div className="text-[11px] text-slate-400">
                  স্থানীয়ভাবে সংরক্ষিত সকল পরীক্ষা ও ইতিহাস ডিফল্ট সিড ডেটায় ফিরিয়ে আনুন।
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 text-xs font-bold transition-colors border border-red-200 dark:border-red-900"
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
