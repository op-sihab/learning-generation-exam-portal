"use client";

import React, { useState } from "react";
import {
  LogIn,
  UserPlus,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  X,
  Sparkles
} from "lucide-react";
import { User, UserRole } from "@/types";

interface AuthModalProps {
  open: boolean;
  canClose?: boolean;
  users: Record<string, User>;
  onLoginSuccess: (email: string, pass: string) => boolean;
  onRegisterUser: (user: User) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  canClose = true,
  users,
  onLoginSuccess,
  onRegisterUser,
  onClose
}) => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [targetBatch, setTargetBatch] = useState("SSC 26/27 Premium Batch");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const pwScore = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    return s;
  })();

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setError("");
    const ok = onLoginSuccess(quickEmail, quickPass);
    if (ok) onClose();
    else setError("লগইন ব্যর্থ হয়েছে।");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (tab === "login") {
      if (!email || !password) {
        setError("অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড প্রদান করুন।");
        return;
      }
      const ok = onLoginSuccess(email.trim(), password);
      if (ok) {
        onClose();
      } else {
        setError("ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
      }
    } else {
      if (!name.trim()) {
        setError("আপনার নাম লিখুন।");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setError("সঠিক ইমেইল এড্রেস প্রদান করুন।");
        return;
      }
      if (users[email.trim()]) {
        setError("এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট তৈরি করা আছে।");
        return;
      }
      if (password.length < 6) {
        setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
        return;
      }
      if (password !== confirmPw) {
        setError("উভয় পাসওয়ার্ড মেলেনি।");
        return;
      }

      const newUser: User = {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        targetBatch,
        dailyGoalExams: 2,
        photo: null,
        createdAt: new Date().toISOString()
      };
      onRegisterUser(newUser);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {tab === "login" ? "অ্যাকাউন্টে প্রবেশ" : "নতুন অ্যাকাউন্ট তৈরি"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Learning Generation Exam Portal
              </p>
            </div>
          </div>
          {canClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 my-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setError("");
            }}
            className={`py-2 rounded-lg transition-all ${
              tab === "login"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            লগইন
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setError("");
            }}
            className={`py-2 rounded-lg transition-all ${
              tab === "register"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            রেজিস্টার
          </button>
        </div>

        {/* Quick Demo Logins */}
        {tab === "login" && (
          <div className="mb-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              দ্রুত পরীক্ষামূলক লগইন:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("demo@lg.com", "123456")}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>তানভীর (শিক্ষার্থী)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@lg.com", "admin123")}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>অ্যাডমিন ইনস্ট্রাক্টর</span>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === "register" && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                পূর্ণ নাম
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: তানভীর আহমেদ"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              ইমেইল
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
                className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {tab === "register" && password && (
              <div className="mt-1.5 flex gap-1 items-center">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1 flex-1 rounded-full ${
                      step <= pwScore
                        ? step <= 2
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {tab === "register" && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="পুনরায় পাসওয়ার্ড লিখুন"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  টার্গেট ব্যাচ
                </label>
                <select
                  value={targetBatch}
                  onChange={(e) => setTargetBatch(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                >
                  <option value="SSC 26/27 Premium Batch">SSC 26/27 Premium Batch</option>
                  <option value="ACS COMPACT GST 2025">ACS COMPACT GST 2025</option>
                  <option value="SUST-RU-BUP Special Varsity Batch">
                    SUST-RU-BUP Special Varsity Batch
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ভূমিকা (Role)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-center ${
                      role === "student"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    শিক্ষার্থী (Student)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-center ${
                      role === "admin"
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    অ্যাডমিন (Admin Studio)
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {tab === "login" ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>লগইন করুন</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>অ্যাকাউন্ট তৈরি করুন</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
