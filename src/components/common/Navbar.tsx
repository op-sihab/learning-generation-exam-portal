"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  FileText,
  Trophy,
  BarChart3,
  Flame,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  User as UserIcon,
  Wrench,
  Menu,
  X,
  LogIn
} from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { toBanglaNum } from "@/utils/format";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    activeUser,
    streak,
    darkMode,
    toggleDarkMode,
    soundEnabled,
    toggleSound,
    openAuthModal
  } = usePortal();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "হোম", href: "/", icon: GraduationCap },
    { label: "কোর্স ও ব্যাচ", href: "/courses", icon: BookOpen },
    { label: "সকল পরীক্ষা", href: "/exams", icon: FileText },
    { label: "লিডারবোর্ড", href: "/leaderboard", icon: Trophy },
    { label: "অ্যানালিটিক্স", href: "/analytics", icon: BarChart3 }
  ];

  const isAdmin = activeUser.role === "admin" || activeUser.role === "instructor";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Learning Generation</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">
                  Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                স্মার্ট মডেল টেস্ট ও মূল্যায়ন
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/studio"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ml-1 ${
                  isActive("/studio")
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60"
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>স্টুডিও</span>
              </Link>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 text-xs font-bold"
              title="ধারাবাহিক অধ্যয়নের দিন"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{toBanglaNum(streak.count)} দিন</span>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={soundEnabled ? "শব্দ বন্ধ করুন" : "শব্দ চালু করুন"}
              aria-label="সাউন্ড সুইচ"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "লাইট মোড" : "ডার্ক মোড"}
              aria-label="থিম সুইচ"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Profile / Auth Button */}
            <Link
              href="/profile"
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group"
            >
              {activeUser.photo ? (
                <img
                  src={activeUser.photo}
                  alt={activeUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                  {activeUser.name.charAt(0)}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                  {activeUser.name}
                </div>
                <div className="text-[10px] text-slate-400 capitalize truncate max-w-[100px]">
                  {activeUser.role === "admin" ? "অ্যাডমিন" : "শিক্ষার্থী"}
                </div>
              </div>
            </Link>

            {/* Mobile Hamburger Menu */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <Link
            href="/studio"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold ${
              isActive("/studio")
                ? "bg-indigo-600 text-white"
                : "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>অ্যাডমিন স্টুডিও</span>
          </Link>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <UserIcon className="w-4 h-4 text-blue-500" />
              <span>প্রোফাইল সেটিংস</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>সুইচ অ্যাকাউন্ট</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
