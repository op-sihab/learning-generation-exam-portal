"use client";

import React, { Suspense } from "react";
import { usePortal } from "@/context/PortalContext";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { NoticeBanner } from "./NoticeBanner";
import { MaintenanceBanner } from "./MaintenanceBanner";
import { Toast } from "./Toast";
import { AuthModal } from "./AuthModal";

export const PortalLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const {
    notice,
    maintenance,
    maintBypass,
    setMaintBypass,
    toastMsg,
    authModalOpen,
    closeAuthModal,
    users,
    loginUser,
    registerUser
  } = usePortal();

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-50">
      <NoticeBanner notice={notice} />
      <MaintenanceBanner
        maintenance={maintenance}
        isBypassed={maintBypass}
        onBypass={() => setMaintBypass(true)}
      />
      <Suspense
        fallback={
          <div className="h-16 w-full bg-[#06070B]/90 border-b border-white/[0.07]" />
        }
      >
        <Navbar />
      </Suspense>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Suspense
          fallback={
            <div className="min-h-[40vh] flex items-center justify-center text-sm text-slate-400">
              লোড হচ্ছে...
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
      <Footer />
      <Toast message={toastMsg} />
      <AuthModal
        open={authModalOpen}
        users={users}
        onLoginSuccess={loginUser}
        onRegisterUser={registerUser}
        onClose={closeAuthModal}
      />
    </div>
  );
};
